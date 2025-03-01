import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCategoriesService } from '../services/product-categories.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Toast } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-product-categories',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-categories.component.html',
  styleUrl: './product-categories.component.css'
})

export class ProductCategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  categories: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productCategoryService: ProductCategoriesService,
    private http: HttpClient
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${environment.apiUrl}/product-categories`, { headers })
      .subscribe({
        next: (data: any) => {
          this.categories = data;
        },
        error: (err) => {
          this.showErrorToast('Nem sikerült betölteni a kategóriákat');
          console.error('Hiba a kategóriák betöltésekor:', err);
        }
      });
  }

  onCreateCategory(): void {
    if (this.categoryForm.valid) {
      const token = localStorage.getItem('admin_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(`${environment.apiUrl}/admin/product-categories`, this.categoryForm.value, { headers })
        .subscribe({
          next: (response: any) => {
            this.loadCategories();
            this.categoryForm.reset();
            this.showSuccessToast('Kategória sikeresen létrehozva');
          },
          error: (err) => {
            this.showErrorToast('Nem sikerült létrehozni a kategóriát');
            console.error('Hiba a kategória létrehozásakor:', err);
          }
        });
    }
  }

  onDeleteCategory(id: number): void {
    if (confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
      const token = localStorage.getItem('admin_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.delete(`${environment.apiUrl}/admin/product-categories/${id}`, { headers })
        .subscribe({
          next: () => {
            this.loadCategories();
            this.showSuccessToast('Kategória sikeresen törölve');
          },
          error: (err) => {
            this.showErrorToast('Nem sikerült törölni a kategóriát');
            console.error('Hiba a kategória törlésekor:', err);
          }
        });
    }
  }

  private showSuccessToast(message: string): void {
    this.successMessage = message;
    const toastElement = document.getElementById('successToast');
    if (toastElement) {
      const toast = new Toast(toastElement);
      toast.show();
    }
  }

  private showErrorToast(message: string): void {
    this.errorMessage = message;
    const toastElement = document.getElementById('errorToast');
    if (toastElement) {
      const toast = new Toast(toastElement);
      toast.show();
    }
  }
}
