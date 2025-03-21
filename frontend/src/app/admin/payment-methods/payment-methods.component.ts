import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface PaymentMethod {
  id?: number;
  name: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})

export class PaymentMethodsComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  success: string | null = null;

  editingId: number | null = null;
  showForm: boolean = false;
  methodForm: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.methodForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      sort_order: [0, [Validators.required, Validators.min(0)]],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    this.isLoading = true;
    const token = localStorage.getItem('admin_token');
    this.http.get<PaymentMethod[]>(`${environment.apiUrl}/admin/payment-methods`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .subscribe({
        next: (data) => {
          this.paymentMethods = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Hiba történt a fizetési módok betöltése során';
          this.isLoading = false;
          console.error('Fizetési módok betöltési hiba:', err);
        }
      });
  }

  resetForm(): void {
    this.methodForm.reset({
      name: '',
      description: '',
      sort_order: 0,
      is_active: true
    });
    this.editingId = null;
  }

  showAddForm(): void {
    this.resetForm();
    this.showForm = true;
  }

  editMethod(method: PaymentMethod): void {
    this.editingId = method.id || null;
    this.methodForm.patchValue({
      name: method.name,
      description: method.description,
      sort_order: method.sort_order,
      is_active: method.is_active
    });
    this.showForm = true;
  }

  cancelEdit(): void {
    this.showForm = false;
    this.resetForm();
  }

  saveMethod(): void {
    if (this.methodForm.invalid) {
      Object.keys(this.methodForm.controls).forEach(key => {
        this.methodForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const methodData = this.methodForm.value;
    const token = localStorage.getItem('admin_token');

    if (this.editingId) {
      this.http.put<any>(`${environment.apiUrl}/admin/payment-methods/${this.editingId}`, methodData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .subscribe({
          next: () => {
            this.success = 'Fizetési mód sikeresen frissítve!';
            this.loadPaymentMethods();
            this.showForm = false;
            this.resetForm();
            setTimeout(() => this.success = null, 3000);
          },
          error: (err) => {
            this.error = 'Hiba történt a fizetési mód frissítése során';
            this.isLoading = false;
            console.error('Fizetési mód frissítési hiba:', err);
          }
        });
    } else {
      this.http.post<any>(`${environment.apiUrl}/admin/payment-methods`, methodData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .subscribe({
          next: () => {
            this.success = 'Fizetési mód sikeresen létrehozva!';
            this.loadPaymentMethods();
            this.showForm = false;
            this.resetForm();
            setTimeout(() => this.success = null, 3000);
          },
          error: (err) => {
            this.error = 'Hiba történt a fizetési mód létrehozása során';
            this.isLoading = false;
            console.error('Fizetési mód létrehozási hiba:', err);
          }
        });
    }
  }

  deleteMethod(id: number): void {
    const token = localStorage.getItem('admin_token');
    if (confirm('Biztosan törölni szeretné ezt a fizetési módot?')) {
      this.isLoading = true;
      this.http.delete<any>(`${environment.apiUrl}/admin/payment-methods/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .subscribe({
          next: () => {
            this.success = 'Fizetési mód sikeresen törölve!';
            this.loadPaymentMethods();
            setTimeout(() => this.success = null, 3000);
          },
          error: (err) => {
            this.error = 'Hiba történt a fizetési mód törlése során';
            this.isLoading = false;
            console.error('Fizetési mód törlési hiba:', err);
          }
        });
    }
  }

  toggleActive(method: PaymentMethod): void {
    this.isLoading = true;
    const updatedData = { ...method, is_active: !method.is_active };
    const token = localStorage.getItem('admin_token');
    this.http.put<any>(`${environment.apiUrl}/admin/payment-methods/${method.id}/toggle-active`, {
      is_active: !method.is_active
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        this.success = `Fizetési mód ${updatedData.is_active ? 'aktiválva' : 'deaktiválva'}!`;
        this.loadPaymentMethods();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Hiba történt a fizetési mód státuszának módosítása során';
        this.isLoading = false;
        console.error('Fizetési mód státusz módosítási hiba:', err);
      }
    });
  }
}