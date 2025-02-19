import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router, RouterLink, Params } from '@angular/router';
import { FindPrimaryImagePipe } from '../../admin/products/products.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-webshop-homepage',
  templateUrl: './webshop-homepage.component.html',
  styleUrls: ['./webshop-homepage.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FindPrimaryImagePipe, RouterLink]
})
export class WebshopHomepage implements OnInit, AfterViewInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  featuredProducts: any[] = [];
  discountedProducts: any[] = [];
  loading: boolean = true;
  storageUrl = environment.storageUrl;
  selectedCategory: string | null = null;
  searchTerm: string = '';
  sortOption: string = 'newest';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
      this.searchTerm = params['search'] || '';
      this.loadProducts();
      this.loadCategories();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const carousel = document.getElementById('discountCarousel');
      if (carousel) {
        new bootstrap.Carousel(carousel, {
          interval: 5000,
          ride: 'carousel',
          wrap: true,
        });
      }
    }, 1000);
  }

  loadProducts(): void {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/products`).subscribe({
      next: (data) => {
        this.products = data;

        const showAllFeatured = this.route.snapshot.queryParams['featured'] === 'true';
        const featuredLimit = showAllFeatured ? 8 : 4;

        this.featuredProducts = this.products
          .filter(product => product.is_featured && product.is_available)
          .slice(0, featuredLimit);

        this.discountedProducts = this.products
          .filter(product => product.discount_price && product.is_available)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Hiba a termékek betöltésekor:', error);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.http.get<any[]>(`${environment.apiUrl}/product-categories`).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Hiba a kategóriák betöltésekor:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products].filter(product => product.is_available);

    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category_id === parseInt(this.selectedCategory as string));
    }

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.latin_name && product.latin_name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    switch (this.sortOption) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_asc':
        filtered.sort((a, b) => {
          const priceA = a.discount_price || a.price;
          const priceB = b.discount_price || b.price;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        filtered.sort((a, b) => {
          const priceA = a.discount_price || a.price;
          const priceB = b.discount_price || b.price;
          return priceB - priceA;
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    this.filteredProducts = filtered;
  }

  selectCategory(categoryId: string | null): void {
    this.selectedCategory = categoryId;
    this.updateQueryParams();
    this.applyFilters();
  }

  onSearch(): void {
    this.updateQueryParams();
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  private updateQueryParams(): void {
    const queryParams: any = {};

    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }

    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getDiscountPercentage(price: number, discountPrice: number): number {
    if (!price || !discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }

  getProductCountByCategory(categoryId: number): number {
    return this.products.filter(p => p.category_id === categoryId).length;
  }

  formatPrice(price: number): string {
    return price ? price.toLocaleString('hu-HU') + ' Ft' : '-';
  }
}