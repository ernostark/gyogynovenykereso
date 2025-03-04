import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-herbdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herb-detail.component.html',
  styleUrl: './herb-detail.component.css',
})
export class HerbdetailComponent implements OnInit {
  post: any;
  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
