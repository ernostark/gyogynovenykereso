import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-admin-messages',
  imports: [CommonModule],
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css',
})
export class AdminMessagesComponent implements OnInit {
  messages: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(`${environment.apiUrl}/admin/messages`, { headers })
      .subscribe({
        next: (response: any) => {
          this.messages = response.messages;
        },
        error: (error) => {
          console.error('Hiba:', error);
        },
      });
  }

  markAsRead(messageId: number) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .put(
        `${environment.apiUrl}/admin/messages/${messageId}/read`,
        {},
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          this.loadMessages();
        },
        error: (error) => {
          console.error('Hiba:', error);
        },
      });
  }
}
