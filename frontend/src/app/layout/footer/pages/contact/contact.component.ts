import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})

export class ContactComponent {
  contactForm: FormGroup
  toastMessage: string | null = null

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [
        Validators.required,
        Validators.maxLength(150),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  showToast(message: string): void {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 6000);
  }

  closeToast(): void {
    this.toastMessage = null;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.http
        .post(`${environment.apiUrl}/contact`, this.contactForm.value)
        .subscribe({
          next: (response: any) => {
            this.showToast(response.message);
            this.contactForm.reset();
          },
          error: (error) => {
            console.error('Hiba:', error);
            alert('Hiba történt az üzenet küldése során.');
          },
        });
    }
  }
}
