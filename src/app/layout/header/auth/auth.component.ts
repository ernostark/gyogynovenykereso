import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  @ViewChild('registerModal', { static: false }) registerModal!: ElementRef;
  email: string = '';
  password: string = '';
  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  toastMessage: string | null = null;

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = sessionStorage.getItem('auth_token');
    this.isLoggedIn = !!token;
  }

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
    });
  }

  showToast(message: string): void {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Kérlek, töltsd ki helyesen az űrlapot!';
      return;
    }

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = response.message;
          this.errorMessage = null;

          this.showToast('Sikeres regisztráció!');

          const modalInstance = bootstrap.Modal.getInstance(
            this.registerModal.nativeElement
          );
          if (modalInstance) {
            modalInstance.hide();
          }

          this.registerForm.reset();

          this.successMessage = null;
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
      },
    });
  }

  closeToast(): void {
    this.toastMessage = null;
  }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Az email és a jelszó megadása kötelező!';
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        if (response.token) {
          sessionStorage.setItem('auth_token', response.token);

          sessionStorage.setItem('user', JSON.stringify(response.user));

          this.isLoggedIn = true;

          this.showToast('Sikeres bejelentkezés!');

          this.successMessage = response.message;
          this.errorMessage = null;

          const modalInstance = bootstrap.Modal.getInstance(
            document.getElementById('loginModal')!
          );
          if (modalInstance) {
            modalInstance.hide();
          }

          this.email = '';
          this.password = '';
          this.successMessage = null;
        } else {
          this.errorMessage = 'Hiba történt a bejelentkezés során.';
        }
      },
      error: (error) => {
        console.error('Hiba a bejelentkezés során:', error);

        if (error.status === 401) {
          this.errorMessage = 'Helytelen email vagy jelszó!';
        } else {
          this.errorMessage = 'Hiba történt a bejelentkezés során.';
        }
      },
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {

        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        this.isLoggedIn = false;
      },
      error: (error) => {
        console.error('Hiba történt a kijelentkezés során:', error);
      },
    });
  }
}
