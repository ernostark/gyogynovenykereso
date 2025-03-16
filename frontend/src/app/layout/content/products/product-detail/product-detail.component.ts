import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { RelatedPostsComponent } from '../../../../related/related-posts/related-posts.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, RelatedPostsComponent, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading: boolean = true;
  error: string | null = null;
  storageUrl = environment.storageUrl;
  selectedImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = 'Termék azonosító nem található!';
        this.loading = false;
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/products/${id}`)
      .subscribe({
        next: (data: any) => {
          this.product = data;

          if (this.product.images && this.product.images.length > 0) {
            const primaryIndex = this.product.images.findIndex((img: any) => img.is_primary);
            this.selectedImageIndex = primaryIndex !== -1 ? primaryIndex : 0;
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Hiba a termék betöltésekor:', err);
          this.error = 'A termék betöltése sikertelen!';
          this.loading = false;
        }
      });
  }

  setSelectedImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getDiscountPercentage(): number {
    if (!this.product || !this.product.price || !this.product.discount_price ||
      this.product.discount_price >= this.product.price) {
      return 0;
    }
    return Math.round(((this.product.price - this.product.discount_price) / this.product.price) * 100);
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('hu-HU') + ' Ft' : '-';
  }

  increaseQuantity(): void {
    if (this.quantity < this.product.stock_quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (this.quantity < 1) {
      this.quantity = 1;
    }

    if (this.quantity > this.product.stock_quantity) {
      this.quantity = this.product.stock_quantity;
    }

    this.quantity = Math.floor(this.quantity);
  }

  addToCart(): void {
    if (this.quantity > 0 && this.quantity <= this.product.stock_quantity) {
      console.log('Kosárba helyezve:', {
        productId: this.product.id,
        name: this.product.name,
        quantity: this.quantity,
        unit: this.product.unit,
        price: this.product.discount_price || this.product.price
      });

      alert(`Sikeresen hozzáadva a kosárhoz: ${this.quantity} ${this.product.unit} ${this.product.name}`);

      this.quantity = 1;
    }
  }
}