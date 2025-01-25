import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8000/api';

  login(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/login', loginData);
  }

  logout(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    return this.http.post<any>(
      'http://localhost:8000/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  updateUserProfile(data: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    return this.http.put<any>('http://localhost:8000/api/profile', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getprofile`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
      },
    });
  }
}
