import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartSubject = new BehaviorSubject<any>(null);
  public cart$ = this.cartSubject.asObservable();

  private cartId: string | null = null;
  public cartLoaded = false;
  private cartRequest: Observable<any> | null = null;

  constructor(private http: HttpClient) {
    this.cartId = localStorage.getItem('cart_id');
  }

  private getCurrentUser(): any {
    const authToken = sessionStorage.getItem('auth_token');
    if (authToken) {
      const tokenParts = authToken.split('|');
      if (tokenParts.length > 0) {
        const userId = tokenParts[0];
        if (userId && !isNaN(Number(userId))) {
          return { id: userId };
        }
      }
    }
    return null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  private getUrlWithParams(endpoint: string): string {
    let params = new HttpParams();
    if (this.cartId) {
      params = params.append('cart_id', this.cartId);
    }
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id) {
      params = params.append('user_id', currentUser.id);
    }
    const queryString = params.toString();
    return `${this.apiUrl}${endpoint}${queryString ? '?' + queryString : ''}`;
  }

  resetCartRequest() {
    this.cartRequest = null;
    this.cartLoaded = false;
  }

  loadCart(): Observable<any> {

    if (this.cartLoaded && this.cartSubject.value) {
      return of(this.cartSubject.value);
    }

    if (this.cartRequest) {
      return this.cartRequest;
    }

    const url = this.getUrlWithParams('/cart');
    this.cartRequest = this.http.get(url, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.success) {
          if (response.cart_id) {
            const cartId = this.cartId = response.cart_id.toString();
            localStorage.setItem('cart_id', cartId);
          }
          this.cartSubject.next({
            items: response.cart.items,
            totalItems: response.total_items,
            subtotal: response.subtotal
          });
          this.cartLoaded = true;
        }
      }),
      shareReplay(1),
    );
    return this.cartRequest;
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const url = this.getUrlWithParams('/cart/items');
    return this.http.post(url, { product_id: productId, quantity }, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.success) {
          if (response.cart_id) {
            this.cartId = response.cart_id.toString();
            if (this.cartId) {
              localStorage.setItem('cart_id', this.cartId);
            }
          }
          this.cartSubject.next({
            items: response.cart.items,
            totalItems: response.total_items,
            subtotal: response.subtotal
          });
        }
      })
    );
  }

  updateCartItem(itemId: number, quantity: number): Observable<any> {
    const url = this.getUrlWithParams(`/cart/items/${itemId}`);
    return this.http.put(url, { quantity }, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.success) {
          if (response.cart_id) {
            this.cartId = response.cart_id.toString();
            if (this.cartId) {
              localStorage.setItem('cart_id', this.cartId);
            }
          }
          this.cartSubject.next({
            items: response.cart.items,
            totalItems: response.total_items,
            subtotal: response.subtotal
          });
        }
      })
    );
  }

  removeCartItem(itemId: number): Observable<any> {
    const url = this.getUrlWithParams(`/cart/items/${itemId}`);
    return this.http.delete(url, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.success) {
          if (response.cart_id) {
            this.cartId = response.cart_id.toString();
            if (this.cartId) {
              localStorage.setItem('cart_id', this.cartId);
            }
          }
          this.cartSubject.next({
            items: response.cart.items,
            totalItems: response.total_items,
            subtotal: response.subtotal
          });
        }
      })
    );
  }

  clearCart(): Observable<any> {
    const url = this.getUrlWithParams('/cart');
    return this.http.delete(url, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      tap((response: any) => {
        if (response.success) {
          if (response.cart_id) {
            this.cartId = response.cart_id.toString();
            if (this.cartId) {
              localStorage.setItem('cart_id', this.cartId);
            }
          }
          this.cartSubject.next({
            items: [],
            totalItems: 0,
            subtotal: 0
          });
        }
      })
    );
  }

  checkout(checkoutData: any): Observable<any> {
    const completeData = {
      ...checkoutData,
      cart_id: this.cartId
    };

    const token = sessionStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/checkout`, completeData, {
      headers: headers,
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        if (response.success) {
          this.cartSubject.next({
            items: [],
            totalItems: 0,
            subtotal: 0
          });
          this.cartId = null;
          localStorage.removeItem('cart_id');
        }
      })
    );
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }
}
