import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  @ViewChild('registerModal', { static: false }) registerModal!: ElementRef;
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    });
  }

  showToast: boolean = false;

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Kérlek, töltsd ki helyesen az űrlapot!';
      return;
    }

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Sikeres regisztráció:', response);

          this.successMessage = response.message;
          this.errorMessage = null;

          this.showToast = true;

          const modalInstance = bootstrap.Modal.getInstance(
            this.registerModal.nativeElement
          );
          if (modalInstance) {
            modalInstance.hide();
          }

          this.registerForm.reset();

          setTimeout(() => {
            this.showToast = false;
          }, 5000);
        }
      },
      error: (error) => {
        if (error.status === 422) {
          const validationErrors = error.error.error;
          this.errorMessage = Object.values(validationErrors)
            .flat()
            .join('<br>');
        } else {
          this.errorMessage = 'Hiba történt a regisztráció során.';
        }

        this.successMessage = null;
      },
    });
  }

  hideToast(): void {
    this.showToast = false;
  }
}
