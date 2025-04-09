import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { RouterLink } from '@angular/router';
import { FindPrimaryImagePipe } from '../../../admin/products/products.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../shared/services/cart-service.service';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css'],
  standalone: true,
  imports: [CommonModule, FindPrimaryImagePipe, RouterLink]
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: any[] = [];
  loading: boolean = true;
  storageUrl = environment.storageUrl;
  toastMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadFeaturedProducts();
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

  loadFeaturedProducts(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        this.featuredProducts = data
          .filter(product => product.is_featured && product.is_available)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.loading = false;
      },
      error: (error) => {
        console.error('Hiba a termékek betöltésekor:', error);
        this.loading = false;
      }
    });
  }

  addToCart(product: any, quantity: number = 1): void {
    if (!product) {
      return;
    }

    if (product.stock_quantity < quantity) {
      this.showToast('Nincs elegendő készleten!');
      return;
    }

    this.cartService.addToCart(product.id, quantity).subscribe({
      next: (response) => {
        if (response.success) {
          this.showToast('A termék sikeresen a kosárba került!');
        } else {
          this.showToast(response.message || 'Hiba történt a kosárba helyezés során.');
        }
      },
      error: (err) => {
        console.error('Kosárba helyezési hiba:', err);
        this.showToast('Hiba történt a kosárba helyezés során. Kérjük, próbálja újra később!');
      }
    });
  }

  getDiscountPercentage(price: number, discountPrice: number): number {
    if (!price || !discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('hu-HU') + ' Ft' : '-';
  }
}