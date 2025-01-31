import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  searchQuery: string = '';

  onSearch() {
    // Itt hívhatod meg a kereső logikát, például a gyógynövények listájának szűrésére
    console.log('Searching for:', this.searchQuery);
  }

}
