import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { AuthService } from 'src/app/shared/services/auth.service';
import { emailValidator } from 'src/app/shared/validators/email-validator';
import { matchValue } from 'src/app/shared/validators/match-value-validator';
import { numericValidator } from 'src/app/shared/validators/numeric-validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  forgotPasswordForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  displaySection: string = 'forgot-password';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.createForgotPasswordForm();
    this.createResetPasswordForm();
  }

  forgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (res: any) => {
          this.displaySection = 'authenticator';
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
    }
  }

  createForgotPasswordForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, emailValidator()]],
    })
  }

  createResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      otp: ['', [Validators.required, numericValidator(), Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
      { validator: matchValue('password', 'confirmPassword') });
  }

  resetPasswordSubmit() {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.router.navigate(['login']);
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
    }
  }

  get forgotPassForm() {
    return this.forgotPasswordForm?.controls;
  }

  get ResetPassForm() {
    return this.resetPasswordForm?.controls;
  }

}
