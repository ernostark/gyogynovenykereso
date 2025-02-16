import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-category-posts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-posts.component.html',
  styleUrl: './category-posts.component.css',
})
export class CategoryPostsComponent implements OnInit {
  posts: any[] = [];
  category: any;
  loading = true;
  storageUrl = environment.storageUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const categoryId = params['id'];
      this.loadCategoryPosts(categoryId);
    });
  }

  loadCategoryPosts(categoryId: number) {
    this.http
      .get(`${environment.apiUrl}/categories/${categoryId}/posts`)
      .subscribe({
        next: (response: any) => {
          this.posts = response.posts;
          this.category = response.category;
          this.loading = false;
        },
        error: (error) => {
          console.error('Hiba:', error);
          this.loading = false;
        },
      });
  }
}
