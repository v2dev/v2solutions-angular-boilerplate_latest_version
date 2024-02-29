import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AuthService } from 'src/app/shared/services/auth.service';
import { emailValidator } from 'src/app/shared/validators/email-validator';
import { matchValue } from 'src/app/shared/validators/match-value-validator';
import { AuthenticatorComponent } from "../authenticator/authenticator.component";
import { EncryptStorageService } from 'src/app/core/services/encrypt-storage.service';
import { AppKeys, AppRoutes } from 'src/app/core/constants/appSettings';
import { ToasterService } from 'src/app/shared/services/toaster.service';
import { alphabetValidator } from 'src/app/shared/validators/alphabet-validator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [SharedModule, AuthenticatorComponent, RouterModule],
  providers: [ToasterService]
})
export class RegisterComponent {
  registerForm!: FormGroup;
  displaySection: string = 'register';
  loading = false;
  imgUrl: string = '';
  otp!: number;
  countryList = [
    { id: 'in', name: 'India' },
    { id: 'us', name: 'United States' }
  ];
  login = AppRoutes.login

  constructor(
    private authService: AuthService,
    private storageService: EncryptStorageService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService) {
    this.authService.isAuthorized.next(false);
    this.storageService.clearLocalStorageByKey(AppKeys.authToken);
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, alphabetValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
      { validator: matchValue('password', 'confirmPassword') });
  }

  signUp() {
    this.loading = true;
    const formValues = this.registerForm.value;
    formValues['country'] = formValues.country.id;
    if (this.registerForm.valid) {
      this.authService.register(formValues).subscribe({
        next: (res: any) => {
          this.toaster.success(res.message, 'Success');
          this.displaySection = 'authenticator';
          this.loading = false;
          this.imgUrl = res.qrCodeUrl;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
    }
  }

  get form() {
    return this.registerForm?.controls;
  }
}
