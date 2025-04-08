import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../shared/services/cart-service.service';
import { CartItemComponent } from "../cart-item/cart-item.component";

@Component({
  selector: 'app-cart-dropdown',
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CartItemComponent]
})
export class CartDropdownComponent implements OnInit {
  isOpen: boolean = false;
  cartItems: any[] = [];
  totalItems: number = 0;
  subtotal: number = 0;

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      if (cart) {
        this.cartItems = cart.items || [];
        this.totalItems = cart.totalItems || 0;
        this.subtotal = cart.subtotal || 0;
      }
    });
  }

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.router.url.includes('/checkout')) {
      return;
    }
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.cart-dropdown-container')) {
      this.closeDropdown();
    }
  }

  increaseQuantity(item: any): void {
    if (item.quantity < item.product.stock_quantity) {
      this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe();
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateCartItem(item.id, item.quantity - 1).subscribe();
    }
  }

  updateQuantity(item: any, quantity: number): void {
    if (quantity < 1) {
      quantity = 1;
    }

    if (quantity > item.product.stock_quantity) {
      quantity = item.product.stock_quantity;
    }

    if (item.quantity !== quantity) {
      this.cartService.updateCartItem(item.id, quantity).subscribe();
    }
  }

  removeItem(item: any): void {
    this.cartService.removeCartItem(item.id).subscribe();
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }
}