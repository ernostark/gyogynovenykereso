import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private adminLoginUrl = `${environment.apiUrl}/admin/login`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {}

  adminLogin(credentials: { email: string; password: string }): void {
    this.http.post(this.adminLoginUrl, credentials).subscribe({
      next: (response: any) => {
        if (response.success) {
          localStorage.setItem('admin_token', response.token);
          this.sharedService.updateAdminStatus(true);
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        console.error('Hiba történt a bejelentkezés során:', error);
        alert('Hibás email vagy jelszó!');
      },
    });
  }

  onLogout(): void {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      console.error('Nincs token a kijelentkezéshez!');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post(`${environment.apiUrl}/admin/logout`, {}, { headers })
      .subscribe({
        next: (response: any) => {
          localStorage.removeItem('admin_token');
          this.sharedService.updateAdminStatus(false);
          this.router.navigate(['/admin/login']);
        },
        error: (error) => {
          console.error('Hiba a kijelentkezés során:', error);
        },
      });
  }
}
