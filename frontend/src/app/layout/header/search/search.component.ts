import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchForm: FormGroup;
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.searchForm = this.formBuilder.group({
      diseases: ['', Validators.required],
    });
  }

  showToast(message: string) {
    const toastEl = document.getElementById('toastMessage') as HTMLElement;
    const toastBody = document.getElementById('toastBody') as HTMLElement;
    if (toastEl && toastBody) {
      toastBody.textContent = message;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  onSearch() {
    if (this.searchForm.invalid) {
      this.showToast('Kérlek, adj meg legalább egy betegséget!');
      return;
    }

    const rawInput = this.searchForm.value.diseases.toString().trim();

    const normalizedInput = rawInput
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const diseasesArray = normalizedInput
      .split(',')
      .map((d: string) => d.trim())
      .filter((d: string) => d !== '');

    console.log('Normalizált betegségek:', diseasesArray);

    const token = localStorage.getItem('admin_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    if (diseasesArray.length === 0) {
      this.searchResults = [];
      return;
    }

    this.http
      .post(
        `${environment.apiUrl}/posts/search-by-diseases`,
        { diseases: diseasesArray },
        { headers: headers }
      )
      .subscribe({
        next: (response: any) => {
          console.log('Teljes válasz:', response);
          this.searchResults = response.posts || [];
        },
        error: (error) => {
          console.error('Hiba a keresés során:', error);
        },
      });
  }

  getFormattedDiseases(diseases: string | string[] | null): string {
    if (!diseases) {
      return 'Nincsenek kapcsolódó betegségek';
    }

    try {
      if (Array.isArray(diseases)) {
        return diseases.join(', ');
      }

      const parsedDiseases = JSON.parse(diseases);

      if (Array.isArray(parsedDiseases)) {
        return [...new Set(parsedDiseases)]
          .filter((disease) => disease && disease.trim() !== '')
          .join(', ');
      }
    } catch (error) {
      console.warn('Nem sikerült a betegségek feldolgozása:', diseases);
    }

    return diseases.toString();
  }

  onSearchInContent(): void {
    if (!this.searchQuery.trim()) {
      this.showToast('Kérlek, adj meg legalább egy keresési szót!');
      return;
    }

    this.http
      .get(`${environment.apiUrl}/posts/search?q=${encodeURIComponent(this.searchQuery.trim())}`)
      .subscribe({
        next: (response: any) => {
          this.searchResults = response.posts || [];
          if (this.searchResults.length === 0) {
            this.showToast('Nincs találat a keresési feltételekre.');
          }
        },
        error: (error) => {
          console.error('Hiba történt a keresés során:', error);
          this.showToast('Hiba történt a keresés során.');
        },
      });
  }
}