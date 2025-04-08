import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../logo/logo.component';
import { SharedService } from '../../../shared/services/shared.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CartDropdownComponent } from "../../../webshop/cart/cart-dropdown/cart-dropdown.component";

declare var bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, LogoComponent, RouterLink, CartDropdownComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})

export class AuthComponent implements OnInit {

  private sharedService: SharedService;
  isAdminLoggedIn$;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    sharedService: SharedService,
    private router: Router,
  ) {
    this.sharedService = sharedService;
    this.isAdminLoggedIn$ = this.sharedService.isAdminLoggedIn$;
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
      }
    });
  }

  @ViewChild('registerModal') registerModal!: ElementRef;

  isAdminRoute: boolean = false;
  email: string = '';
  password: string = '';
  registerForm: FormGroup;
  updateForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  toastMessage: string | null = null;
  isLoggedIn: boolean = false;
  isMenuCollapsed = true;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const navbar = document.querySelector('.navbar');
    const toggler = document.querySelector('.navbar-toggler');
    const target = event.target as HTMLElement;

    if (toggler && (toggler === target || toggler.contains(target))) {
      return;
    }

    if (this.isMenuOpen && navbar && !navbar.contains(target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  ngOnInit(): void {

    this.checkLoginStatus();
    this.initializeUpdateForm();

    document.getElementById('registerModal')?.addEventListener('hidden.bs.modal', () => {
      this.errorMessage = null;
      this.successMessage = null;
    });

    document.getElementById('loginModal')?.addEventListener('hidden.bs.modal', () => {
      this.errorMessage = null;
      this.successMessage = null;
    });

    const successMsg = sessionStorage.getItem('toastMessage');
    if (successMsg) {
      setTimeout(() => {
        this.showToast(successMsg);
        sessionStorage.removeItem('toastMessage');
      }, 200);
    }
  }

  showToast(message: string): void {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }

  conditionalPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('password_confirmation')?.value;

      if (password && !confirmPassword) {
        return { confirmPasswordRequired: true };
      }

      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  initializeUpdateForm(): void {
    this.updateForm = this.fb.group(
      {
        password: [
          null,
          [
            Validators.minLength(8),
            Validators.pattern(/[a-z]/),
            Validators.pattern(/[A-Z]/),
            Validators.pattern(/[0-9]/),
          ],
        ],
        password_confirmation: [null],
        country: [null, [Validators.required, Validators.maxLength(30)]],
        postal_code: [null, [Validators.required, Validators.maxLength(10)]],
        city: [null, [Validators.required, Validators.maxLength(40)]],
        street: [null, [Validators.required, Validators.maxLength(80)]],
        address_line_2: [null, [Validators.maxLength(80)]],
      },
      { validators: this.conditionalPasswordValidator() }
    );
  }

  checkLoginStatus(): void {
    const token = sessionStorage.getItem('auth_token');
    this.isLoggedIn = !!token;
  }

  onRegister(): void {

    const formData = this.registerForm.value;

    this.authService.register(formData).subscribe({
      next: (response) => {
        if (response.success) {
          sessionStorage.setItem('toastMessage', 'Sikeres regisztráció!');

          const modalInstance = bootstrap.Modal.getInstance(
            this.registerModal.nativeElement
          );
          if (modalInstance) {
            modalInstance.hide();
          }

          document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');

          this.registerForm.reset();
          this.successMessage = null;
          this.errorMessage = null;

          window.location.reload();

        }
      },
      error: (error) => {
        console.log('Teljes hibaválasz:', error);

        if (error.status === 422) {
          if (error.error && error.error.error) {
            const errorFields = Object.values(error.error.error);
            const allErrors: string[] = [];

            errorFields.forEach(fieldErrors => {
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach(err => allErrors.push(err));
              }
            });

            if (allErrors.length > 0) {
              this.errorMessage = allErrors.join('<br>');
            } else {
              this.errorMessage = error.error.message || 'Érvénytelen adatok!';
            }
          } else {
            this.errorMessage = error.error.message || 'Érvénytelen adatok!';
          }
        } else {
          this.errorMessage = 'Hiba történt a regisztráció során!';
          console.error('Regisztrációs hiba:', error);
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
          if (response.tokenType === 'admin_token') {
            localStorage.setItem('admin_token', response.token);
            this.sharedService.updateAdminStatus(true);

            if (response.userToken) {
              sessionStorage.setItem('auth_token', response.userToken);
            }
          } else {
            sessionStorage.setItem('auth_token', response.token);
          }

          this.isLoggedIn = true;
          this.successMessage = response.message;
          this.errorMessage = null;

          const modalInstance = bootstrap.Modal.getInstance(
            document.getElementById('loginModal')!
          );

          if (modalInstance) {
            modalInstance.hide();
            setTimeout(() => {
              document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
              document.body.classList.remove('modal-open');
              document.body.style.overflow = '';
              document.body.style.paddingRight = '';

              this.showToast('Sikeres bejelentkezés!');
            }, 200);
          }

          this.email = '';
          this.password = '';
          this.successMessage = null;
        } else {
          this.errorMessage = 'Hiba történt a bejelentkezés során.';
        }
      },
      error: (error) => {
        console.log('Teljes hibaválasz:', error);

        if (error.status === 401) {
          this.errorMessage = 'Helytelen email vagy jelszó!';
        }
        else if (error.status === 422) {
          if (error.error && error.error.error) {
            const errorFields = Object.values(error.error.error);
            const allErrors: string[] = [];

            errorFields.forEach(fieldErrors => {
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach(err => allErrors.push(err));
              }
            });

            if (allErrors.length > 0) {
              this.errorMessage = allErrors.join('<br>');
            } else {
              this.errorMessage = error.error.message || 'Érvénytelen adatok!';
            }
          } else {
            this.errorMessage = error.error.message || 'Érvénytelen adatok!';
          }
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

        this.isLoggedIn = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Hiba történt a kijelentkezés során:', error);
      },
    });
  }

  onUpdateProfile(): void {
    if (this.updateForm.invalid) {
      this.errorMessage = 'Kérlek, töltsd ki helyesen az űrlapot!';
      return;
    }

    const formData = this.updateForm.value;

    this.authService.updateUserProfile(formData).subscribe({
      next: (response) => {
        if (response.success) {
          sessionStorage.setItem('toastMessage', 'Sikeresen módosította a profilját!');

          const modalInstance = bootstrap.Modal.getInstance(
            document.getElementById('updateProfileModal')
          );
          if (modalInstance) {
            modalInstance.hide();
          }

          document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.removeProperty('overflow');
          document.body.style.removeProperty('padding-right');

          this.updateForm.reset();
          this.successMessage = null;

          window.location.reload();
        }
      },
      error: (error) => {
        if (error.status === 422) {
          const validationErrors = error.error.error || {};
          this.errorMessage = Object.values(validationErrors)
            .flat()
            .join('<br>');
        } else {
          this.errorMessage = 'Hiba történt a profil frissítése során!';
        }
      },
    });
  }

  onEditProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.updateForm.patchValue({
            country: response.user.country,
            postal_code: response.user.postal_code,
            city: response.user.city,
            street: response.user.street,
            address_line_2: response.user.address_line_2,
          });
        }
      },
      error: (error) => {
        console.error('Hiba a profil adatok betöltése során:', error);
      },
    });
  }
}
