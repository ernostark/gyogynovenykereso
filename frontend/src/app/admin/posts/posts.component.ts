import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';

declare var bootstrap: any;

@Component({
  selector: 'app-posts',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  categories: any[] = [];
  editPostForm: FormGroup;
  selectedFile: File | null = null;
  selectedPostId: number | null = null;
  modalInstance: any;
  toastMessage: string | null = null;
  storageUrl = environment.storageUrl;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private http: HttpClient
  ) {
    this.editPostForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category_id: [''],
      status: ['draft', Validators.required],
      diseases: [''],
      featured: [false]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategories();
    this.postService.toastMessage$.subscribe((message) => {
      this.toastMessage = message;
    });
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (response) => {
        if (response.success) {
          this.posts = response.posts;
        } else {
          console.error('Hiba:', response.message);
        }
      },
      error: (error) => {
        console.error('Hiba a bejegyzések lekérése során:', error);
      },
    });
    const modalElement = document.getElementById('editPostModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  loadCategories(): void {
    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get(`${environment.apiUrl}/admin/categories`, { headers })
      .subscribe({
        next: (data: any) => {
          this.categories = data.categories;
        },
        error: (error) => {
          console.error('Hiba történt a kategóriák betöltése során:', error);
        },
      });
  }

  openEditModal(post: any): void {
    this.selectedPostId = post.id;

    let diseases = '';
    if (post.diseases) {
      try {
        const diseasesArray = Array.isArray(post.diseases)
          ? post.diseases
          : JSON.parse(post.diseases);
        diseases = Array.isArray(diseasesArray) ? diseasesArray.join(', ') : '';
      } catch (e) {
        console.error('Hiba a betegségek feldolgozása során:', e);
        diseases = post.diseases;
      }
    }

    this.editPostForm.patchValue({
      title: post.title,
      content: post.content,
      category_id: post.category_id,
      status: post.status,
      diseases: diseases,
    });
    this.modalInstance = new bootstrap.Modal(
      document.getElementById('editPostModal')!
    );
    this.modalInstance.show();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpdatePost(): void {
    if (this.editPostForm.invalid) {
      alert('Töltsd ki az összes kötelező mezőt!');
      return;
    }

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('title', this.editPostForm.value.title || '');
    formData.append('content', this.editPostForm.value.content || '');
    formData.append('category_id', this.editPostForm.value.category_id || '');
    formData.append('status', this.editPostForm.value.status || 'draft');
    formData.append('featured', this.editPostForm.value.featured ? '1' : '0');

    if (this.editPostForm.value.diseases) {
      const diseasesArray = this.editPostForm.value.diseases
        .split(',')
        .map((disease: string) => disease.trim());
      formData.append('diseases', JSON.stringify(diseasesArray));
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http
      .post(
        `${environment.apiUrl}/admin/posts/${this.selectedPostId}`,
        formData,
        {
          headers: headers,
        }
      )
      .subscribe({
        next: (response) => {
          this.showToast('Bejegyzés sikeresen frissítve!');
          this.modalInstance?.hide();
          this.loadPosts();
        },
        error: (error) => {
          console.error('Hiba történt a frissítés során:', error);
          this.showToast('Hiba történt a frissítés során!');
        },
      });
  }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }

  closeToast(): void {
    this.toastMessage = null;
  }

  onDeletePost(postId: number): void {
    if (!confirm('Biztosan törölni szeretnéd ezt a bejegyzést?')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .delete(`${environment.apiUrl}/admin/posts/${postId}`, { headers })
      .subscribe({
        next: (response) => {
          this.showToast('Bejegyzés sikeresen törölve!');
          this.loadPosts();
        },
        error: (error) => {
          console.error('Hiba történt a törlés során:', error);
          this.showToast('Hiba történt a törlés során!');
        },
      });
  }

  getFormattedDiseases(diseases: any): string {
    if (!diseases) return '';

    try {
      if (Array.isArray(diseases)) {
        return diseases.join(', ');
      }

      if (typeof diseases === 'string') {
        const parsed = JSON.parse(diseases);
        return Array.isArray(parsed) ? parsed.join(', ') : diseases;
      }

      return '';
    } catch (error) {
      console.error('Hiba a diseases formázásakor:', error);
      return '';
    }
  }
}
