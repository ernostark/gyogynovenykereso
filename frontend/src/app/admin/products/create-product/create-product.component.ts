import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-product',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css',
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  selectedFiles: File[] = [];
  primaryImageIndex: number = 0;
  toastMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      latin_name: [''],
      description: ['', Validators.required],
      usage: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      discount_price: ['', [Validators.min(0)]],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['g', Validators.required],
      category_id: [''],
      is_available: [true],
      is_featured: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }

  closeToast(): void {
    this.toastMessage = null;
  }

  loadCategories(): void {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(`${environment.apiUrl}/product-categories`, { headers })
      .subscribe({
        next: (data: any) => {
          this.categories = data;
        },
        error: (error) => {
          console.error('Hiba a kategóriák betöltésekor:', error);
        },
      });
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 2 * 1024 * 1024) {
          this.showToast(`A "${file.name}" fájl mérete nem lehet nagyobb mint 2MB!`);
          continue;
        }
        this.selectedFiles.push(file);
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    if (this.primaryImageIndex >= this.selectedFiles.length) {
      this.primaryImageIndex = Math.max(0, this.selectedFiles.length - 1);
    }
  }

  setPrimaryImage(index: number) {
    this.primaryImageIndex = index;
  }

  getSafeImageUrl(file: File): SafeUrl {
    const objectUrl = window.URL.createObjectURL(file);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.showToast('Kérlek, tölts ki minden kötelező mezőt!');
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.showToast('Legalább egy képet fel kell tölteni a termékhez!');
      return;
    }

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('latin_name', this.productForm.value.latin_name || '');
    formData.append('description', this.productForm.value.description);
    formData.append('usage', this.productForm.value.usage);
    formData.append('price', this.productForm.value.price);
    formData.append('discount_price', this.productForm.value.discount_price || '');
    formData.append('stock_quantity', this.productForm.value.stock_quantity);
    formData.append('unit', this.productForm.value.unit);
    formData.append('category_id', this.productForm.value.category_id || '');
    formData.append('is_available', this.productForm.value.is_available ? '1' : '0');
    formData.append('is_featured', this.productForm.value.is_featured ? '1' : '0');
    formData.append('primary_image_index', this.primaryImageIndex.toString());

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('images[]', this.selectedFiles[i]);
    }

    this.http
      .post(`${environment.apiUrl}/admin/products`, formData, { headers })
      .subscribe({
        next: (response) => {
          this.showToast('Termék sikeresen létrehozva!');
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard/products']);
          }, 3000);
        },
        error: (error) => {
          console.error('Hiba történt:', error);
          if (error.error && error.error.errors) {
            console.log('Validációs hibák:', error.error.errors);
            this.showToast('Hiba történt a termék létrehozása során!');
          }
        },
      });
  }
}