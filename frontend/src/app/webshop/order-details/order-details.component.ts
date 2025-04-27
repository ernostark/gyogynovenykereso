import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface OrderStatus {
  id: number;
  name: string;
  color: string;
  sort_order: number;
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
  billing_postal_code: string;
  billing_city: string;
  billing_street: string;
  billing_address_line_2: string;
  shipping_name: string;
  shipping_phone: string;
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
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  orderStatuses: OrderStatus[] = [];
  standardStatuses: OrderStatus[] = [
    { id: 1, name: 'Új rendelés', color: '#3490dc', sort_order: 1 },
    { id: 2, name: 'Feldolgozás alatt', color: '#f6993f', sort_order: 2 },
    { id: 3, name: 'Kiszállítás alatt', color: '#38c172', sort_order: 3 },
    { id: 4, name: 'Teljesítve', color: '#4dc0b5', sort_order: 4 }
  ];

  storageUrl = environment.storageUrl || '/storage/';

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
    this.http.get<OrderStatus[]>(`${environment.apiUrl}/order-statuses`).subscribe({
      next: (data) => {
        this.orderStatuses = data;
      },
      error: (err) => {
        console.error('Státuszok betöltési hiba:', err);
        this.orderStatuses = this.standardStatuses;
      }
    });
  }

  loadOrder(id: number): void {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');

    this.http.get<Order>(`${environment.apiUrl}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Hiba történt a rendelés betöltése során';
        this.isLoading = false;
        console.error('Rendelés betöltési hiba:', err);
      }
    });
  }

  getOrderStatusSteps(): OrderStatus[] {
    const statuses = this.orderStatuses.length > 0 ? this.orderStatuses : this.standardStatuses;

    return statuses
      .filter(s => s.id !== 5)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  isStatusCompleted(statusId: number): boolean {
    if (!this.order) return false;

    const steps = this.getOrderStatusSteps();
    const currentStatusIndex = steps.findIndex(s => s.id === this.order?.status.id);
    const thisStatusIndex = steps.findIndex(s => s.id === statusId);

    return thisStatusIndex < currentStatusIndex;
  }

  isStatusActive(statusId: number): boolean {
    return this.order?.status.id === statusId;
  }

  getStatusProgress(): number {
    if (!this.order) return 0;

    const steps = this.getOrderStatusSteps();
    const totalSteps = steps.length;
    const currentStatusIndex = steps.findIndex(s => s.id === this.order?.status.id);

    if (currentStatusIndex === -1) return 0;

    return ((currentStatusIndex + 1) / totalSteps) * 100;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU') + ' Ft';
  }
}