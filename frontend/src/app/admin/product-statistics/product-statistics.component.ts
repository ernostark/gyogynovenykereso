import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, PieController, ArcElement
} from 'chart.js';

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, PieController, ArcElement
);

@Component({
  selector: 'app-product-statistics',
  templateUrl: './product-statistics.component.html',
  styleUrls: ['./product-statistics.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductStatisticsComponent implements OnInit {
  statistics: any = {};
  isLoading: boolean = false;

  constructor(private http: HttpClient) { }

  private charts: { [key: string]: Chart | null } = {
    'viewsChart': null,
    'salesChart': null,
  };

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    const token = localStorage.getItem('admin_token');

    this.http.get(`${environment.apiUrl}/admin/product-statistics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.statistics = data;
        this.isLoading = false;
        this.createCharts();
      },
      error: (err) => {
        console.error('Hiba a statisztikák betöltése során:', err);
        this.isLoading = false;
      }
    });
  }

  private createCharts(): void {
    if (!this.statistics.topViewedProducts || !this.statistics.topSoldProducts) {
      return;
    }

    requestAnimationFrame(() => {
      this.createViewsChart();
      this.createSalesChart();
    });
  }

  createViewsChart(): void {
    const ctx = document.getElementById('viewsChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.charts['viewsChart']) {
      this.charts['viewsChart'].destroy();
    }

    const labels = this.statistics.topViewedProducts.map((p: any) => p.name);
    const data = this.statistics.topViewedProducts.map((p: any) => p.view_count);

    this.charts['viewsChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Megtekintések száma',
          data: data,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: 'rgb(53, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Top 10 legtöbbet megtekintett termék'
          }
        }
      }
    });
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.charts['salesChart']) {
      this.charts['salesChart'].destroy();
    }

    const labels = this.statistics.topSoldProducts.map((p: any) => p.name);
    const data = this.statistics.topSoldProducts.map((p: any) => p.sale_count);

    this.charts['salesChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Eladások száma',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Top 10 legtöbbet eladott termék'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Eladott mennyiség'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Termék neve'
            }
          }
        }
      }
    });
  }
}