import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private apiUrl = `${environment.apiUrl}`;

  private toastMessageSubject = new BehaviorSubject<string | null>(null);
  toastMessage$ = this.toastMessageSubject.asObservable();

  constructor(private http: HttpClient) { }

  showToast(message: string) {
    this.toastMessageSubject.next(message);
    setTimeout(() => {
      this.toastMessageSubject.next(null);
    }, 5000);
  }

  getProducts(): Observable<any> {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/products`, { headers });
  }

  updateProduct(productId: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(
      `${this.apiUrl}/admin/products/${productId}`,
      formData,
      { headers }
    );
  }

  deleteProduct(productId: number): Observable<any> {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/admin/products/${productId}`, { headers });
  }

  getFeaturedProducts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/featured`);
  }

  getLatestProducts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/latest`);
  }
}