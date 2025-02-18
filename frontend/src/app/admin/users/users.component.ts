import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  country: string;
  postal_code: string;
  city: string;
  street: string;
  address_line_2: string | null;
  is_admin: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ success: boolean, users: User[] }>(`${environment.apiUrl}/admin/users`, { headers })
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.loading = false;
        },
        error: (error) => {
          console.error('Hiba a felhasználók betöltése során:', error);
          this.error = 'Hiba történt a felhasználók betöltése során.';
          this.loading = false;
        }
      });
  }

  toggleAdminStatus(userId: number) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.apiUrl}/admin/users/${userId}/toggle-admin`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Hiba az admin jogosultság módosítása során:', error);
        }
      });
  }
}