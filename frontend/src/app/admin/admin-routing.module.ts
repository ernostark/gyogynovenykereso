import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { AdminGuard } from '../guards/admin.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostsComponent } from './posts/posts.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { CategoriesComponent } from './categories/categories.component';
import { AdminMessagesComponent } from './messages/admin-messages/admin-messages.component';
import { ProductCategoriesComponent } from './product-categories/product-categories.component';
import { SubscribersComponent } from './dashboard/subscribers/subscribers.component';
import { ShippingMethodsComponent } from './shipping-methods/shipping-methods.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { ProductStatisticsComponent } from './product-statistics/product-statistics.component';

const routes: Routes = [
  { path: 'login', component: AdminAuthComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'posts', component: PostsComponent },
      { path: 'posts/create', component: CreatePostComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/create', component: CreateProductComponent },
      { path: 'products/edit/:id', component: EditProductComponent },
      { path: 'product_categories', component: ProductCategoriesComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'shipping-methods', component: ShippingMethodsComponent },
      { path: 'payment-methods', component: PaymentMethodsComponent },
      { path: 'product-statistics', component: ProductStatisticsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'users', component: UsersComponent },
      { path: 'admin-messages', component: AdminMessagesComponent },
      { path: 'subscribers', component: SubscribersComponent },
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }