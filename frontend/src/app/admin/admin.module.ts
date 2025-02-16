import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    RouterModule,
    AdminRoutingModule,
    AdminAuthComponent,
    DashboardComponent,
    CommonModule,
    PostsComponent,
    CreatePostComponent,
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    OrdersComponent,
    UsersComponent
  ],
  exports: [AdminAuthComponent, DashboardComponent],
})
export class AdminModule {}
