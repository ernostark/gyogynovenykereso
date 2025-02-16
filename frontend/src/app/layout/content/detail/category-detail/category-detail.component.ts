import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css',
})
export class CategoryDetailComponent implements OnInit {
  categories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get(`${environment.apiUrl}/categories`).subscribe({
      next: (data: any) => {
        this.categories = data.categories;
        console.log('Betöltött kategóriák:', this.categories);
      },
      error: (error) => {
        console.error('Hiba a kategóriák betöltésekor:', error);
      },
    });
  }

  getImageUrl(imagePath: string | null): string {
    if (imagePath) {
      return `${environment.apiUrl}/storage/${imagePath}`;
    }
    return '/storage/images/default_category.png';
  }
}
