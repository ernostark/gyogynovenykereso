import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/admin-auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private auth: AuthService) {}

  onLogout(): void {
    this.auth.onLogout();
  }
}
