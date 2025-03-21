import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../shared/services/cart-service.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartIconComponent implements OnInit {
  totalItems: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      if (cart) {
        this.totalItems = cart.totalItems;
      }
    });

    this.cartService.loadCart().subscribe();
  }
}