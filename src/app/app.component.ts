import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header/header.component';
import { HerblistComponent } from "./layout/content/list/herblist/herblist.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, HerblistComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'gyogynovenykereso';
}