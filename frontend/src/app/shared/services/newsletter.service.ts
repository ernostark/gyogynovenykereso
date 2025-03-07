import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class NewsletterService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  subscribe(email: string, privacyAccepted: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/newsletter/subscribe`, {
      email,
      privacy_accepted: privacyAccepted
    });
  }
}