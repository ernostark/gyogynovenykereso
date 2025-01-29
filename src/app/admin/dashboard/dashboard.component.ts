import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/admin-auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private auth: AuthService) {}

  onLogout(): void {
    this.auth.onLogout();
  }
}
