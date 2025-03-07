import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NewsletterService } from '../../shared/services/newsletter.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  constructor(private router: Router, private newsletterService: NewsletterService) { }

  newsletterEmail: string = '';
  privacyAccepted: boolean = false;
  toastMessage: string | null = null;
  isSubscribing: boolean = false;

  showToast(message: string): void {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }

  closeToast(): void {
    this.toastMessage = null;
  }

  subscribeNewsletter(): void {
    if (!this.newsletterEmail || !this.privacyAccepted) {
      return;
    }

    this.isSubscribing = true;

    this.newsletterService.subscribe(this.newsletterEmail, this.privacyAccepted)
      .subscribe({
        next: (response) => {
          this.newsletterEmail = '';
          this.privacyAccepted = false;
          this.showToast(response.message || 'Sikeres feliratkozás! Köszönjük!');
          this.isSubscribing = false;
        },
        error: (error) => {
          this.isSubscribing = false;
          console.error('Hiba a feliratkozás során:', error);

          if (error.error && error.error.errors) {
            if (error.error.errors.email) {
              this.showToast(error.error.errors.email[0]);
            } else {
              this.showToast('Hiba történt a feliratkozás során. Kérjük, próbáld újra!');
            }
          } else if (error.error && error.error.message) {
            this.showToast(error.error.message);
          } else {
            this.showToast('Ismeretlen hiba történt. Kérjük, próbáld újra később!');
          }
        }
      });
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  currentYear = new Date().getFullYear();
}
