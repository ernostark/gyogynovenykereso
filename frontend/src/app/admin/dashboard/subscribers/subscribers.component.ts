import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';

export interface Subscriber {
  id: number;
  email: string;
  user_id: number | null;
  is_active: boolean;
  token: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  }
}

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})

export class SubscribersComponent implements OnInit {
  subscribers: Subscriber[] = [];
  loading = true;
  error: string | null = null;
  showDeleteConfirmation = false;
  subscriberToDelete: Subscriber | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadSubscribers();
  }

  loadSubscribers() {
    this.loading = true;
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${environment.apiUrl}/admin/newsletter/subscribers`, { headers })
      .subscribe({
        next: (response) => {
          this.subscribers = response.data || response;
          this.loading = false;
        },
        error: (error) => {
          console.error('Hiba a feliratkozók betöltése során:', error);
          this.error = 'Hiba történt a feliratkozók betöltése során.';
          this.loading = false;
        }
      });
  }

  showConfirmDelete(subscriber: Subscriber) {
    this.subscriberToDelete = subscriber;
    this.showDeleteConfirmation = true;
  }

  hideConfirmDelete() {
    this.showDeleteConfirmation = false;
    this.subscriberToDelete = null;
  }

  deleteSubscriber(id: number) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${environment.apiUrl}/admin/newsletter/subscribers/${id}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.showSuccessMessage(response.message || 'Feliratkozó sikeresen törölve!');
          this.hideConfirmDelete();
          this.loadSubscribers();
        },
        error: (error) => {
          console.error('Hiba a feliratkozó törlése során:', error);
          this.error = 'Hiba történt a feliratkozó törlésekor.';
          this.hideConfirmDelete();
        }
      });
  }

  toggleSubscriberStatus(id: number, currentStatus: boolean) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.apiUrl}/admin/newsletter/subscribers/${id}/toggle-status`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          this.showSuccessMessage(response.message || 'Feliratkozó státusza sikeresen módosítva!');
          this.loadSubscribers();
        },
        error: (error) => {
          console.error('Hiba a feliratkozó státuszának módosítása során:', error);
          this.error = 'Hiba történt a feliratkozó státuszának módosításakor.';
        }
      });
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}