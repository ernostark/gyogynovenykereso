import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface OrderStatus {
  id: number;
  name: string;
  color: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total: number;
  status: OrderStatus;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');

    this.http.get<Order[]>(`${environment.apiUrl}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a rendelések betöltése során';
        this.isLoading = false;
        console.error('Rendelések betöltési hiba:', err);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }
}