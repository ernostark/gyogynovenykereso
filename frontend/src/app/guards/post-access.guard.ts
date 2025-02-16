import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostAccessGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const postId = route.params['id'];
    const token = localStorage.getItem('admin_token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http
      .get(`${environment.apiUrl}/posts/${postId}`, { headers })
      .pipe(
        map((response: any) => {
          if (response.success) {
            return true;
          }
          this.router.navigate(['/']);
          return false;
        }),
        catchError((error) => {
          if (error.status === 403) {
            this.router.navigate(['/']);
          }
          return of(false);
        })
      );
  }
}
