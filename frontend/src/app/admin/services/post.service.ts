import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/admin/posts`;

  private toastMessageSubject = new BehaviorSubject<string | null>(null);
  toastMessage$ = this.toastMessageSubject.asObservable();

  constructor(private http: HttpClient) {}

  showToast(message: string) {
    this.toastMessageSubject.next(message);
    setTimeout(() => {
      this.toastMessageSubject.next(null);
    }, 5000);
  }

  getPosts(): Observable<any> {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  updatePost(postId: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${environment.apiUrl}/admin/posts/${postId}`,
      formData,
      { headers }
    );
  }

  getFeaturedPosts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/posts/featured`);
  }

  getLatestPosts() {
    return this.http.get(`${environment.apiUrl}/posts/latest`);
  }
}
