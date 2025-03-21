import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrderStatus {
  id: number;
  name: string;
  color: string;
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  status: OrderStatus;
  status_histories: any[];
  shipping_method: any;
  payment_method: any;
  billing_name: string;
  billing_email: string;
  billing_phone: string;
  billing_country: string;
  billing_postal_code: string;
  billing_city: string;
  billing_street: string;
  billing_address_line_2: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_country: string;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_street: string;
  shipping_address_line_2: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  notes: string;
  order_items: any[];
}

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  orderStatuses: OrderStatus[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  error: string | null = null;
  success: string | null = null;

  newStatusId: number | null = null;
  statusComment: string = '';

  environment = environment;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadOrderStatuses();
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.loadOrder(orderId);
      }
    });
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

  loadOrder(id: number): void {
    this.isLoading = true;
    const token = localStorage.getItem('admin_token');

    this.http.get<Order>(`${environment.apiUrl}/admin/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data) => {
        this.order = data;
        this.newStatusId = this.order.status.id;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a rendelés betöltése során';
        this.isLoading = false;
        console.error('Rendelés betöltési hiba:', err);
      }
    });
  }

  updateStatus(): void {
    if (!this.order || !this.newStatusId) {
      return;
    }

    this.isSubmitting = true;
    const token = localStorage.getItem('admin_token');

    this.http.post(`${environment.apiUrl}/admin/orders/${this.order.id}/status`, {
      status_id: this.newStatusId,
      comment: this.statusComment
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (response: any) => {
        this.success = 'Rendelés státusza sikeresen frissítve!';
        this.loadOrder(this.order!.id);
        this.statusComment = '';
        this.isSubmitting = false;
        setTimeout(() => this.success = null, 3000);
      },
      error: (err) => {
        this.error = 'Hiba történt a státusz frissítése során';
        this.isSubmitting = false;
        console.error('Státusz frissítési hiba:', err);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }
}