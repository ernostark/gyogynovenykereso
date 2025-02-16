import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private isAdminLoggedInSubject = new BehaviorSubject<boolean>(false);
  isAdminLoggedIn$ = this.isAdminLoggedInSubject.asObservable();

  constructor() {
    this.isAdminLoggedInSubject.next(!!localStorage.getItem('admin_token'));
  }

  updateAdminStatus(isAdmin: boolean) {
    this.isAdminLoggedInSubject.next(isAdmin);
  }
}
