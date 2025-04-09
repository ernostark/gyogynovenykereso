import { Routes } from '@angular/router';
import { SearchComponent } from './layout/header/search/search.component';
import { PostSingleViewComponent } from './layout/content/detail/post-single-view/post-single-view.component';
import { PostAccessGuard } from './guards/post-access.guard';
import { HomeComponent } from './layout/home/home.component';
import { CategoryDetailComponent } from './layout/content/detail/category-detail/category-detail.component';
import { CategoryPostsComponent } from './layout/content/detail/category-posts/category-posts.component';
import { AboutUsComponent } from './layout/footer/pages/about-us/about-us.component';
import { FaqComponent } from './layout/footer/pages/faq/faq.component';
import { ContactComponent } from './layout/footer/pages/contact/contact.component';
import { PrivacyPolicyComponent } from './layout/footer/pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './layout/footer/pages/terms/terms.component';
import { ProductDetailComponent } from './layout/content/products/product-detail/product-detail.component';
import { WebshopHomepage } from './webshop/webshop-homepage/webshop-homepage.component';
import { CartPageComponent } from './webshop/cart/cart-page/cart-page.component';
import { CheckoutComponent } from './webshop/checkout/checkout/checkout.component';
import { OrderDetailComponent } from './webshop/order-details/order-details.component';
import { OrdersComponent } from './webshop/orders/orders.component';
import { DiscountedProductsComponent } from './webshop/discounted-products/discounted-products/discounted-products.component';
import { FeaturedProductsComponent } from './webshop/featured-products/featured-products/featured-products.component';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'posts/:id',
    component: PostSingleViewComponent,
    canActivate: [PostAccessGuard],
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
  {
    path: 'akcios-termekek',
    component: DiscountedProductsComponent,
    title: 'Akciós termékeink'
  },
  {
    path: 'kiemelt-termekek',
    component: FeaturedProductsComponent,
    title: 'Kiemelt termékeink'
  },
  {
    path: 'categories',
    component: CategoryDetailComponent,
  },
  {
    path: 'category/:id',
    component: CategoryPostsComponent,
  },
  {
    path: 'webshop',
    component: WebshopHomepage,
  },
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];