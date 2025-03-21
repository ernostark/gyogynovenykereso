import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../shared/services/cart-service.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;
  shippingCost: number = 0;
  totalAmount: number = 0;
  loading: boolean = true;
  error: string | null = null;
  storageUrl = environment.storageUrl || '/storage/';

  freeShippingThreshold: number = 15000;
  defaultShippingCost: number = 1500;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();

    this.cartService.cart$.subscribe(cart => {
      if (cart) {
        this.cartItems = cart.items || [];
        this.subtotal = cart.subtotal || 0;
        this.calculateTotals();
      }
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }

  handleQuantityChange(item: any, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);

    if (!isNaN(newQuantity)) {
      this.updateQuantity(item, newQuantity);
    }
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.loadCart().subscribe({
      next: (response) => {
        if (response && response.success) {
          this.cartItems = response.cart.items || [];
          this.subtotal = response.subtotal || 0;
          this.calculateTotals();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a kosár betöltése során. Kérjük, próbálja újra később!';
        this.loading = false;
        console.error('Kosár betöltési hiba:', err);
      }
    });
  }

  calculateTotals(): void {
    this.shippingCost = this.subtotal >= this.freeShippingThreshold ? 0 : this.defaultShippingCost;
    this.totalAmount = this.subtotal + this.shippingCost;
  }

  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    if (newQuantity > item.product.stock_quantity) {
      newQuantity = item.product.stock_quantity;
    }

    if (item.quantity !== newQuantity) {
      this.cartService.updateCartItem(item.id, newQuantity).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.cartItems = response.cart.items || [];
            this.subtotal = response.subtotal || 0;
            this.calculateTotals();
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Hiba történt a mennyiség frissítése során.';
          this.loading = false;
          console.error('Mennyiség frissítési hiba:', err);
        }
      });
    }
  }

  removeItem(item: any): void {
    if (confirm('Biztosan el szeretné távolítani a terméket a kosárból?')) {
      this.loading = true;
      this.cartService.removeCartItem(item.id).subscribe({
        next: (response) => {
          if (response && response.success) {
            this.cartItems = response.cart.items || [];
            this.subtotal = response.subtotal || 0;
            this.calculateTotals();
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Hiba történt a termék eltávolítása során.';
          this.loading = false;
          console.error('Termék eltávolítási hiba:', err);
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Biztosan szeretné kiüríteni a kosarat?')) {
      this.loading = true;
      this.cartService.clearCart().subscribe({
        next: (response) => {
          if (response && response.success) {
            this.cartItems = [];
            this.subtotal = 0;
            this.calculateTotals();
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Hiba történt a kosár kiürítése során.';
          this.loading = false;
          console.error('Kosár kiürítési hiba:', err);
        }
      });
    }
  }

  increaseQuantity(item: any): void {
    if (item.quantity < item.product.stock_quantity) {
      this.updateQuantity(item, item.quantity + 1);
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }

  getDiscountPercentage(originalPrice: number, discountPrice: number): number {
    if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  }

  getFreeShippingRemainder(): number {
    return Math.max(0, this.freeShippingThreshold - this.subtotal);
  }

  getFreeShippingProgress(): number {
    const percentage = (this.subtotal / this.freeShippingThreshold) * 100;
    return Math.min(100, Math.max(0, percentage));
  }
}