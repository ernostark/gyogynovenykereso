import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private adminLoginUrl = 'http://localhost:8000/api/admin/login';

  constructor(private http: HttpClient, private router: Router) {}

  adminLogin(credentials: { email: string; password: string }): void {
    this.http.post(this.adminLoginUrl, credentials).subscribe({
      next: (response: any) => {
        if (response.success) {
          localStorage.setItem('admin_token', response.token);
          this.router.navigate(['/admin/dashboard']);
        } else {
          alert(response.message);
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
      .post('http://localhost:8000/api/admin/logout', {}, { headers })
      .subscribe({
        next: (response: any) => {
          console.log(response.message);
          localStorage.removeItem('admin_token');
          this.router.navigate(['/admin/login']);
        },
        error: (error) => {
          console.error('Hiba a kijelentkezés során:', error);
        },
      });
  }
}
