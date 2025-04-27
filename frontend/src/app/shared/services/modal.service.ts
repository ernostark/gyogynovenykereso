import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openLoginModalSource = new Subject<void>();

  openLoginModal$ = this.openLoginModalSource.asObservable();

  constructor() { }

  openLoginModal() {
    this.openLoginModalSource.next();
  }

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}