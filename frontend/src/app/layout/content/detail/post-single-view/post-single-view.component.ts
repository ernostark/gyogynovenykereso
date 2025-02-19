import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { RelatedProductsComponent } from '../../../../related/related-products/related-products.component';

@Component({
  selector: 'app-post-single-view',
  standalone: true,
  imports: [CommonModule, RelatedProductsComponent],
  templateUrl: './post-single-view.component.html',
  styleUrl: './post-single-view.component.css',
})
export class PostSingleViewComponent implements OnInit {
  post: any;
  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadPost(id);
    });
  }

  loadPost(id: string) {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(`${environment.apiUrl}/posts/${id}`, { headers })
      .subscribe({
        next: (response: any) => {
          this.post = response.post;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Hiba történt a bejegyzés betöltése során';
          this.loading = false;
          console.error('Error:', error);
        },
      });
  }

  getFormattedDiseases(diseases: string[] | string | null): string {
    if (!diseases) {
      return 'Nincsenek kapcsolódó betegségek';
    }

    if (Array.isArray(diseases)) {
      return diseases.join(', ');
    }

    return diseases;
  }

}
