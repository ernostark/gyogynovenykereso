import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  loading = false;
  submitted = false;
  resetComplete = false;
  token: string = '';
  email: string = '';
  toastMessage = '';
  error = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    this.email = this.route.snapshot.queryParams['email'] || '';

    if (!this.token || !this.email) {
      this.showToast('Érvénytelen vagy hiányzó token és email paraméterek.', true);
      this.router.navigate(['/forgot-password']);
      return;
    }

    this.initForm();
  }

  get f() {
    return this.resetForm.controls;
  }

  initForm(): void {
    this.resetForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],
      password_confirmation: ['', Validators.required]
    }, {
      validator: this.mustMatch('password', 'password_confirmation')
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ ['mustMatch']: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;

    const resetData = {
      token: this.token,
      email: this.resetForm.get('email')?.value || '',
      password: this.resetForm.get('password')?.value || '',
      password_confirmation: this.resetForm.get('password_confirmation')?.value || ''
    };

    this.authService.resetPassword(resetData)
      .subscribe({
        next: () => {
          this.loading = false;
          this.resetComplete = true;
          this.showToast('Jelszavad sikeresen frissítve! Most már bejelentkezhetsz.', false);
        },
        error: (error) => {
          this.loading = false;

          if (error.status === 422) {
            this.showToast('A jelszó nem felel meg a biztonsági követelményeknek.', true);
          } else if (error.status === 400 || error.status === 404) {
            this.showToast('Érvénytelen vagy lejárt token. Kérjük, kérj új jelszó-visszaállító linket.', true);
          } else {
            this.showToast('Hiba történt a jelszó frissítése során.', true);
          }

          console.error('Password reset error:', error);
        }
      });
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