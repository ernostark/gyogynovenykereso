import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelatedContentService } from '../../shared/services/related-content-service.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RelatedProductsComponent implements OnInit {
  @Input() post: any;
  relatedProducts: any[] = [];
  storageUrl = environment.storageUrl;

  constructor(private relatedContentService: RelatedContentService) { }

  ngOnInit(): void {
    if (this.post) {
      this.loadRelatedProducts();
    }
  }

  loadRelatedProducts(): void {
    this.relatedContentService.getRelatedProductsForPost(this.post)
      .subscribe({
        next: (products) => {
          this.relatedProducts = products;
          this.processProductImages();
        },
        error: (error) => {
          console.error('Error loading related products:', error);
        }
      });
  }

  private processProductImages(): void {
    this.relatedProducts.forEach(product => {
      if (product.images && product.images.length > 0) {
        const primaryImage = product.images.find((img: any) => img.is_primary);
        product.primary_image = primaryImage || product.images[0];
      }
    });
  }

  getDiscountPercentage(price: number, discountPrice: number): number {
    if (!price || !discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }
}