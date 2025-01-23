import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HerbService {
  private apiUrl = 'https://your-api-url.com/herbs';

  constructor(private http: HttpClient) {}

  getHerbs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getHerbById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  searchHerbs(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?q=${query}`);
  }
}
