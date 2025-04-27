import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  emailSent = false;
  toastMessage = '';
  error = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.forgotPasswordForm.get('email')?.value || '';

    this.authService.forgotPassword(email)
      .subscribe({
        next: () => {
          this.loading = false;
          this.emailSent = true;
          this.showToast('Jelszó-visszaállító link elküldve!', false);
        },
        error: (error) => {
          this.loading = false;

          if (error.status === 404) {
            this.showToast('Ez az e-mail cím nem szerepel a rendszerben.', true);
          } else if (error.status === 429) {
            this.showToast('Túl sok kérés. Kérjük próbáld meg később.', true);
          } else {
            this.showToast('Hiba történt a kérés feldolgozása során.', true);
          }

          console.error('Password reset error:', error);
        }
      });
  }

  resetForm(): void {
    this.submitted = false;
    this.emailSent = false;
    this.forgotPasswordForm.reset();
  }

  openLoginModal(): void {
    this.modalService.openLoginModal();
  }

  showToast(message: string, isError: boolean = false): void {
    this.toastMessage = message;
    this.error = isError;

    const toastEl = document.getElementById('toastMessage');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
}