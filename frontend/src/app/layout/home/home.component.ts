import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../../admin/services/post.service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  featuredPosts: any[] = [];
  latestPosts: any[] = [];
  loading = true;
  loadingLatest = true;
  error: string | null = null;
  storageUrl = environment.storageUrl;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.loadFeaturedPosts();
    this.loadLatestPosts();
  }

  loadFeaturedPosts() {
    this.loading = true;
    this.error = null;

    this.postService.getFeaturedPosts().subscribe({
      next: (response) => {
        this.featuredPosts = response.posts;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Hiba történt a kiemelt bejegyzések betöltése során.';
        this.loading = false;
        console.error('Error:', error);
      },
    });
  }

  ngAfterViewInit() {
    const carousel = document.getElementById('featuredCarousel');
    if (carousel) {
      new bootstrap.Carousel(carousel, {
        interval: 4000,
        ride: 'carousel',
        wrap: true,
      });
    }
  }

  loadLatestPosts() {
    this.loadingLatest = true;
    this.postService.getLatestPosts().subscribe({
      next: (response) => {
        this.latestPosts = (response as any).posts;
        this.loadingLatest = false;
      },
      error: (error) => {
        console.error('Hiba a legújabb bejegyzések betöltése során:', error);
        this.loadingLatest = false;
      },
    });
  }
}
