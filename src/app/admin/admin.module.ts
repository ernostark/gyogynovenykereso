import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    RouterModule,
    AdminRoutingModule,
    AdminAuthComponent,
    DashboardComponent,
    CommonModule,
  ],
  exports: [AdminAuthComponent, DashboardComponent],
})
export class AdminModule {}
