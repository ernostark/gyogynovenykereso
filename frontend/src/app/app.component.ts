import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./layout/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  constructor(public router: Router) {}

  title = 'gyogynovenykereso';
}