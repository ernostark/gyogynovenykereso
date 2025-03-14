import { Routes } from '@angular/router';
import { SearchComponent } from './layout/header/search/search.component';
import { HerbdetailComponent } from './layout/content/detail/post-single-view/post-single-view.component';
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
    component: HerbdetailComponent,
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
    path: '**',
    redirectTo: 'home',
  }
];