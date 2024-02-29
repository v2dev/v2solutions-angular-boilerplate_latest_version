import { Component, Input } from '@angular/core';
import { OtpModel, RequestModel } from '../login/login.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EncryptStorageService } from 'src/app/core/services/encrypt-storage.service';
import { AppKeys, AppRoutes } from 'src/app/core/constants/appSettings';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { numericValidator } from 'src/app/shared/validators/numeric-validator';

@Component({
  selector: 'app-authenticator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './authenticator.component.html',
  styleUrl: './authenticator.component.scss'
})
export class AuthenticatorComponent {
  authenticatorForm!: FormGroup;
  loading: boolean = false;
  @Input() imgUrl!: string;
  @Input() authInfo!: RequestModel;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private readonly storageService: EncryptStorageService,
    private router: Router) {
    this.createForm();
  }

  createForm() {
    this.authenticatorForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), numericValidator()]],
    })
  }


  get form() {
    return this.authenticatorForm?.controls;
  }

  submitOtp() {
    this.loading = true;
    const data: OtpModel = {
      email: this.authInfo.email,
      mfaToken: this.authenticatorForm.value.otp
    }
    if (this.authenticatorForm.valid) {
      this.authService.verifyOtp(data).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.storageService.setLocalStorageItem(AppKeys.authToken, res.jwtToken);
          this.router.navigateByUrl(`/${AppRoutes.dashboard}`);
        },
        error: (err: any) => {
          this.loading = false;
        }
      })
    }
  }
}
