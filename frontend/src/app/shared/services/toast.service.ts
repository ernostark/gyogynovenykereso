import { Injectable } from '@angular/core';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  /**
   * Show a toast notification
   * @param message - Message to display
   * @param isError - Whether this is an error message
   * @param duration - How long to display the toast (ms)
   */
  showToast(message: string, isError: boolean = false, duration: number = 5000): void {
    const toastEl = document.getElementById('toastMessage');

    if (toastEl) {
      const toastBodyEl = document.getElementById('toastBody');

      if (toastBodyEl) {
        toastBodyEl.textContent = message;
      }

      if (isError) {
        toastEl.classList.remove('bg-primary', 'bg-success');
        toastEl.classList.add('bg-danger');
      } else {
        toastEl.classList.remove('bg-danger', 'bg-success');
        toastEl.classList.add('bg-primary');
      }

      const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: duration
      });

      toast.show();
    }
  }
}