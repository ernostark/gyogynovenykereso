import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header/header.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./layout/footer/footer.component";
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  constructor(public router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd
      )
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  title = 'gyogynovenykereso';
  
}