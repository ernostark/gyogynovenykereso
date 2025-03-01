import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var bootstrap: any;

@Pipe({
  name: 'findPrimaryImage',
  standalone: true
})
export class FindPrimaryImagePipe implements PipeTransform {
  transform(images: any[]): any {
    if (!images || !images.length) return null;

    const primaryImage = images.find(img => img.is_primary);

    if (primaryImage) return primaryImage;

    return images[0];
  }
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FindPrimaryImagePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {

  private fileUrlCache = new Map<File, SafeResourceUrl>();

  products: any[] = [];
  categories: any[] = [];
  editProductForm: FormGroup;
  selectedFiles: File[] = [];
  primaryImageIndex: number = 0;
  existingImages: any[] = [];
  imagesToRemove: number[] = [];
  selectedProductId: number | null = null;
  modalInstance: any;
  toastMessage: string | null = null;
  storageUrl = environment.storageUrl;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      latin_name: [''],
      description: ['', Validators.required],
      usage: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      discount_price: ['', [Validators.min(0)]],
      stock_quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['g', Validators.required],
      category_id: [''],
      is_available: [true]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.productService.toastMessage$.subscribe((message) => {
      this.toastMessage = message;
    });
  }

  ngOnDestroy() {
    this.fileUrlCache.forEach((_, file) => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });
    this.fileUrlCache.clear();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.error('Hiba a termékek lekérése során:', error);
      },
    });
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
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
          console.error('Hiba történt a kategóriák betöltése során:', error);
        },
      });
  }

  openEditModal(product: any): void {
    this.selectedProductId = product.id;
    this.existingImages = product.images || [];
    this.selectedFiles = [];
    this.imagesToRemove = [];

    const primaryImage = this.existingImages.find(img => img.is_primary);
    if (primaryImage) {
      this.primaryImageIndex = this.existingImages.indexOf(primaryImage);
    } else {
      this.primaryImageIndex = 0;
    }

    this.editProductForm.patchValue({
      name: product.name,
      latin_name: product.latin_name || '',
      description: product.description,
      usage: product.usage,
      price: product.price,
      discount_price: product.discount_price || '',
      stock_quantity: product.stock_quantity,
      unit: product.unit,
      category_id: product.category_id || '',
      is_available: product.is_available
    });

    this.modalInstance = new bootstrap.Modal(
      document.getElementById('editProductModal')!
    );
    this.modalInstance.show();
  }

  onFilesSelected(event: any): void {
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

  markImageForRemoval(imageId: number): void {
    if (!this.imagesToRemove.includes(imageId)) {
      this.imagesToRemove.push(imageId);
    }
  }

  cancelImageRemoval(imageId: number): void {
    const index = this.imagesToRemove.indexOf(imageId);
    if (index !== -1) {
      this.imagesToRemove.splice(index, 1);
    }
  }

  removeNewFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  setPrimaryImage(imageId: number, isExisting: boolean = true): void {
    if (isExisting) {
      this.existingImages.forEach(img => img.is_primary = (img.id === imageId));
    } else {
      this.primaryImageIndex = imageId;
    }
  }

  getSafeImageUrl(file: File): SafeResourceUrl {
    if (!this.fileUrlCache.has(file)) {
      const url = URL.createObjectURL(file);
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.fileUrlCache.set(file, safeUrl);
    }
    return this.fileUrlCache.get(file)!;
  }

  onUpdateProduct(): void {
    if (this.editProductForm.invalid) {
      this.showToast('Töltsd ki az összes kötelező mezőt!');
      return;
    }

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('name', this.editProductForm.value.name);
    formData.append('latin_name', this.editProductForm.value.latin_name || '');
    formData.append('description', this.editProductForm.value.description);
    formData.append('usage', this.editProductForm.value.usage);
    formData.append('price', this.editProductForm.value.price);
    formData.append('discount_price', this.editProductForm.value.discount_price || '');
    formData.append('stock_quantity', this.editProductForm.value.stock_quantity);
    formData.append('unit', this.editProductForm.value.unit);
    formData.append('category_id', this.editProductForm.value.category_id || '');
    formData.append('is_available', this.editProductForm.value.is_available ? '1' : '0');

    if (this.imagesToRemove.length > 0) {
      for (const imageId of this.imagesToRemove) {
        formData.append('remove_image_ids[]', imageId.toString());
      }
    }

    if (this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('new_images[]', this.selectedFiles[i]);
      }
    }

    const primaryImage = this.existingImages.find(img => img.is_primary);
    if (primaryImage) {
      formData.append('primary_image_id', primaryImage.id.toString());
    }

    this.http
      .post(
        `${environment.apiUrl}/admin/products/${this.selectedProductId}`,
        formData,
        {
          headers: headers,
        }
      )
      .subscribe({
        next: (response) => {
          this.showToast('Termék sikeresen frissítve!');
          this.modalInstance?.hide();
          this.loadProducts();
        },
        error: (error) => {
          console.error('Hiba történt a frissítés során:', error);
          this.showToast('Hiba történt a frissítés során!');
        },
      });
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

  onDeleteProduct(productId: number): void {
    if (!confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe({
      next: (response) => {
        this.showToast('Termék sikeresen törölve!');
        setTimeout(() => {
          this.loadProducts();
        }, 3000);
      },
      error: (error) => {
        console.error('Hiba történt a törlés során:', error);
        this.showToast('Hiba történt a törlés során!');
      },
    });
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('hu-HU') + ' Ft' : '-';
  }

  getDiscountPercentage(price: number, discountPrice: number): number {
    if (!price || !discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }
}