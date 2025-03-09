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
    }, 6000);
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
          this.showToast('Sikeres feliratkozás! Elküldtünk egy üdvözlő emailt az email címedre.');
          this.isSubscribing = false;
        },
        error: (error) => {
          this.isSubscribing = false;
          console.error('Hiba a feliratkozás során:', error);

          if (error.error && error.error.errors) {
            if (error.error.errors.email) {
              const errorMsg = error.error.errors.email[0];

              if (errorMsg.includes('has already been taken')) {
                this.showToast('Ez az email cím már feliratkozott a hírlevélre!');
              } else if (errorMsg.includes('valid email')) {
                this.showToast('Kérjük, adj meg egy érvényes email címet!');
              } else {
                this.showToast('Hiba az email címmel. Kérjük, ellenőrizd!');
              }
            } else if (error.error.errors.privacy_accepted) {
              this.showToast('Kérjük, fogadd el az adatvédelmi nyilatkozatot!');
            } else {
              this.showToast('Hiba történt a feliratkozás során. Kérjük, próbáld újra!');
            }
          } else {
            this.showToast('Hiba történt a feliratkozás során. Kérjük, próbáld újra később!');
          }
        }
      });
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  currentYear = new Date().getFullYear();
}
