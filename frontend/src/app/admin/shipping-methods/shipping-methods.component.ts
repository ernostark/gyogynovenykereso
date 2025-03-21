import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface ShippingMethod {
  id?: number;
  name: string;
  description: string;
  cost: number;
  estimated_delivery_days: number;
  is_active: boolean;
}

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ShippingMethodsComponent implements OnInit {
  shippingMethods: ShippingMethod[] = [];
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
      cost: [0, [Validators.required, Validators.min(0)]],
      estimated_delivery_days: [1, [Validators.required, Validators.min(1)]],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadShippingMethods();
  }

  loadShippingMethods(): void {
    this.isLoading = true;
    const token = localStorage.getItem('admin_token');
    this.http.get<ShippingMethod[]>(`${environment.apiUrl}/admin/shipping-methods`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .subscribe({
        next: (data) => {
          this.shippingMethods = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Hiba történt a szállítási módok betöltése során';
          this.isLoading = false;
          console.error('Szállítási módok betöltési hiba:', err);
        }
      });
  }

  resetForm(): void {
    this.methodForm.reset({
      name: '',
      description: '',
      cost: 0,
      estimated_delivery_days: 1,
      is_active: true
    });
    this.editingId = null;
  }

  showAddForm(): void {
    this.resetForm();
    this.showForm = true;
  }

  editMethod(method: ShippingMethod): void {
    this.editingId = method.id || null;
    this.methodForm.patchValue({
      name: method.name,
      description: method.description,
      cost: method.cost,
      estimated_delivery_days: method.estimated_delivery_days,
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
      this.http.put<any>(`${environment.apiUrl}/admin/shipping-methods/${this.editingId}`, methodData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .subscribe({
          next: () => {
            this.success = 'Szállítási mód sikeresen frissítve!';
            this.loadShippingMethods();
            this.showForm = false;
            this.resetForm();
            setTimeout(() => this.success = null, 3000);
          },
          error: (err) => {
            this.error = 'Hiba történt a szállítási mód frissítése során';
            this.isLoading = false;
            console.error('Szállítási mód frissítési hiba:', err);
          }
        });
    } else {
      this.http.post<any>(`${environment.apiUrl}/admin/shipping-methods`, methodData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .subscribe({
          next: () => {
            this.success = 'Szállítási mód sikeresen létrehozva!';
            this.loadShippingMethods();
            this.showForm = false;
            this.resetForm();
            setTimeout(() => this.success = null, 3000);
          },
          error: (err) => {
            this.error = 'Hiba történt a szállítási mód létrehozása során';
            this.isLoading = false;
            console.error('Szállítási mód létrehozási hiba:', err);
          }
        });
    }
  }

  deleteMethod(id: number): void {
    const token = localStorage.getItem('admin_token');
    if (confirm('Biztosan törölni szeretné ezt a szállítási módot?')) {
      this.isLoading = true;
      this.http.delete<any>(`${environment.apiUrl}/admin/shipping-methods/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .subscribe({
          next: () => {
            this.success = 'Szállítási mód sikeresen törölve!';
            this.loadShippingMethods();
            setTimeout(() => this.success = null, 3000);
          },
          error: (err) => {
            this.error = 'Hiba történt a szállítási mód törlése során';
            this.isLoading = false;
            console.error('Szállítási mód törlési hiba:', err);
          }
        });
    }
  }

  toggleActive(method: ShippingMethod): void {
    this.isLoading = true;
    const updatedData = { ...method, is_active: !method.is_active };
    const token = localStorage.getItem('admin_token');
    this.http.put<any>(`${environment.apiUrl}/admin/shipping-methods/${method.id}/toggle-active`, {
      is_active: !method.is_active
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        this.success = `Szállítási mód ${updatedData.is_active ? 'aktiválva' : 'deaktiválva'}!`;
        this.loadShippingMethods();
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Hiba történt a szállítási mód státuszának módosítása során';
        this.isLoading = false;
        console.error('Szállítási mód státusz módosítási hiba:', err);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }
}