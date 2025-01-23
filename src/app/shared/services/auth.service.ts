import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8000/api';

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  logout(): void {
    console.log('Kijelentkezés');
  }

  isAuthenticated(): boolean {
    return true;
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
