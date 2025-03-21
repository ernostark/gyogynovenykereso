import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../shared/services/cart-service.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartItemComponent implements OnInit {
  @Input() item: any;
  @Input() showActions: boolean = true;
  @Input() showRemove: boolean = true;
  @Input() compact: boolean = false;

  @Output() quantityChanged = new EventEmitter<{ item: any, quantity: number }>();
  @Output() itemRemoved = new EventEmitter<any>();

  storageUrl = environment.storageUrl || '';

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    if (this.item.product && this.item.product.primary_image) {
    }
  }

  processProductImage(): void {
    if (this.item.product && this.item.product.images && this.item.product.images.length > 0) {
      const primaryImage = this.item.product.images.find((img: any) =>
        img.is_primary === true || img.is_primary === 1);

      this.item.product.primary_image = primaryImage || this.item.product.images[0];
    }
  }

  increaseQuantity(): void {
    if (this.item.quantity < this.item.product?.stock_quantity) {
      this.quantityChanged.emit({
        item: this.item,
        quantity: this.item.quantity + 1
      });
    }
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.quantityChanged.emit({
        item: this.item,
        quantity: this.item.quantity - 1
      });
    }
  }

  handleQuantityChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);

    if (!isNaN(newQuantity) && newQuantity > 0 &&
      newQuantity <= (this.item.product?.stock_quantity || 0)) {
      this.quantityChanged.emit({
        item: this.item,
        quantity: newQuantity
      });
    } else {
      target.value = this.item.quantity.toString();
    }
  }

  removeItem(): void {
    this.itemRemoved.emit(this.item);
  }

  getDiscountPercentage(): number {
    if (!this.item.unit_price || !this.item.discount_price ||
      this.item.discount_price >= this.item.unit_price) {
      return 0;
    }
    return Math.round(((this.item.unit_price - this.item.discount_price) /
      this.item.unit_price) * 100);
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  getItemSubtotal(): number {
    const price = this.item.discount_price ?? this.item.unit_price;
    return price * this.item.quantity;
  }
}