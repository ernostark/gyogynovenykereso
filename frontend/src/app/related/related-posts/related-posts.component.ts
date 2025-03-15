import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RelatedContentService } from '../../shared/services/related-content-service.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-related-posts',
  templateUrl: './related-posts.component.html',
  styleUrls: ['./related-posts.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RelatedPostsComponent implements OnInit {
  @Input() product: any;
  relatedPosts: any[] = [];
  storageUrl = environment.storageUrl;

  constructor(private relatedContentService: RelatedContentService) { }

  ngOnInit(): void {
    if (this.product) {
      this.loadRelatedPosts();
    }
  }

  loadRelatedPosts(): void {
    this.relatedContentService.getRelatedPostsForProduct(this.product)
      .subscribe({
        next: (posts) => {
          this.relatedPosts = posts;
        },
        error: (error) => {
          console.error('Error loading related posts:', error);
        }
      });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}