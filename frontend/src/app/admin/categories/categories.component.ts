import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-categories',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  successMessage = 'Sikeres!';
  errorMessage = 'Sikertelen!';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  showToast(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = message;
      const successToastEl = document.getElementById('successToast');
      if (successToastEl) {
        const toast = new bootstrap.Toast(successToastEl);
        toast.show();
      }
    } else {
      this.errorMessage = message;
      const errorToastEl = document.getElementById('errorToast');
      if (errorToastEl) {
        const toast = new bootstrap.Toast(errorToastEl);
        toast.show();
      }
    }
  }

  loadCategories(): void {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(`${environment.apiUrl}/admin/categories`, { headers })
      .subscribe({
        next: (data: any) => {
          this.categories = data.categories;
        },
        error: (error) => {
          console.error('Hiba a kategóriák betöltésekor:', error);
        },
      });
  }

  onCreateCategory(): void {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .post(
        `${environment.apiUrl}/admin/categories`,
        this.categoryForm.value,
        { headers }
      )
      .subscribe({
        next: () => {
          this.showToast('Kategória sikeresen létrehozva!', 'success');
          this.categoryForm.reset();
          this.loadCategories();
        },
        error: (error) => {
          console.error('Hiba történt:', error);
        },
      });
  }

  onDeleteCategory(categoryId: number): void {
    if (!confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) return;

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .delete(`${environment.apiUrl}/admin/categories/${categoryId}`, {
        headers,
      })
      .subscribe({
        next: () => {
          this.showToast('Kategória sikeresen törölve!', 'success');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Hiba történt:', error);
        },
      });
  }
}
