import { Component, OnInit } from '@angular/core';
import { AppKeys, AppRoutes } from 'src/app/core/constants/appSettings';
import { EncryptStorageService } from 'src/app/core/services/encrypt-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/shared/validators/email-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  termsAndCondition: boolean = false;
  isChecked: boolean = false;
  displaySection: string = 'login';

  constructor(
    private formBuilder: FormBuilder,
    private readonly storageService: EncryptStorageService,
    private readonly authService: AuthService,
    private router: Router) {
    this.authService.isAuthorized.next(false);
    this.storageService.clearLocalStorageByKey(AppKeys.authToken);
  }

  ngOnInit(): void {
    this.authService.isAuthorized.subscribe(res => {
      if (res) {
        this.router.navigateByUrl(`/${AppRoutes.dashboard}`);
      }
    })
    this.createForm();
    this.socialLogin();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', Validators.required]
    });
  }

  socialLogin() {
    this.authService.socialLogin().subscribe(res => {
      if (res && res.success) {
        this.storageService.setLocalStorageItem(AppKeys.authToken, res.jwtToken);
        this.router.navigateByUrl(`/${AppRoutes.dashboard}`);
      }
    })
  }

  get form() {
    return this.loginForm.controls
  }

  login() {
    this.loading = true;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.displaySection = 'otp';
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
    }
  }
}
