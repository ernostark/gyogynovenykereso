import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface OrderStatus {
  id: number;
  name: string;
  color: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  billing_name: string;
  total: number;
  status: OrderStatus;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  orderStatuses: OrderStatus[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  statusFilter: string = '';
  currentPage: number = 1;
  pagination: Pagination | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrderStatuses();
    this.loadOrders();
  }

  loadOrderStatuses(): void {
    const token = localStorage.getItem('admin_token');
    this.http.get<OrderStatus[]>(`${environment.apiUrl}/admin/order-statuses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data) => {
        this.orderStatuses = data;
      },
      error: (err) => {
        console.error('Státuszok betöltési hiba:', err);
      }
    });
  }

  loadOrders(page: number = 1): void {
    this.isLoading = true;
    const token = localStorage.getItem('admin_token');

    this.http.get<any>(`${environment.apiUrl}/admin/orders?page=${page}${this.statusFilter ? '&status_id=' + this.statusFilter : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.filteredOrders = [...this.orders];
        this.pagination = {
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a rendelések betöltése során';
        this.isLoading = false;
        console.error('Rendelések betöltési hiba:', err);
      }
    });
  }

  filterOrders(): void {
    this.loadOrders(1);
  }

  refreshOrders(): void {
    this.loadOrders(this.currentPage);
  }

  changePage(page: number): void {
    if (page < 1 || (this.pagination && page > this.pagination.last_page)) {
      return;
    }
    this.currentPage = page;
    this.loadOrders(page);
  }

  getPages(): number[] {
    if (!this.pagination) return [];

    const pages: number[] = [];
    const totalPages = this.pagination.last_page;
    const currentPage = this.pagination.current_page;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }
}