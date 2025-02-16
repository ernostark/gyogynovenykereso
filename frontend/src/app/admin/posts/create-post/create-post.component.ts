import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  categories: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category_id: [''],
      status: ['draft', Validators.required],
      diseases: [''],
      featured: [false]
    });
  }

  toastMessage: string | null = null;

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }

  closeToast(): void {
    this.toastMessage = null;
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  get diseasesArray(): FormArray {
    return this.postForm.get('diseases') as FormArray;
  }

  addDisease(): void {
    this.diseasesArray.push(this.fb.control('', Validators.required));
  }

  removeDisease(index: number): void {
    this.diseasesArray.removeAt(index);
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
          console.error('Hiba a kategóriák betöltésekor:', error);
        },
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A fájl mérete nem lehet nagyobb mint 2MB!');
        return;
      }
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postService.showToast('Kérlek, tölts ki minden kötelező mezőt!');
      return;
    }

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('content', this.postForm.value.content);
    formData.append('category_id', this.postForm.value.category_id);
    formData.append('status', this.postForm.value.status);
    formData.append('featured', this.postForm.value.featured ? '1' : '0');

    if (this.postForm.value.diseases) {
      const diseasesArray: string[] = this.postForm.value.diseases
        .split(',')
        .map((disease: string) => disease.trim());
      formData.append('diseases', JSON.stringify(diseasesArray));
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.http
      .post(`${environment.apiUrl}/admin/posts`, formData, { headers })
      .subscribe({
        next: (response) => {
          this.postService.showToast('Bejegyzés sikeresen létrehozva!');
          this.router.navigate(['/admin/dashboard/posts']);
        },
        error: (error) => {
          console.error('Hiba történt:', error);
          if (error.error && error.error.errors) {
            console.log('Validációs hibák:', error.error.errors);
            this.postService.showToast(
              'Hiba történt a bejegyzés létrehozása során!'
            );
          }
        },
      });
  }
}
