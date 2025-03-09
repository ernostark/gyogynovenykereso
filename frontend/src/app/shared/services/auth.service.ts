import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}`;

  getUserToken(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      ...loginData,
      request_type: 'auth_token'
    });
  }

  login(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }

  logout(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    return this.http.post<any>(
      `${this.apiUrl}/logout`,
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
    const token = localStorage.getItem('admin_token') || sessionStorage.getItem('auth_token');
    return this.http.put<any>(`${this.apiUrl}/profile`, data, {
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
