import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HerbdetailComponent } from '../../layout/content/detail/herbdetail/herbdetail.component';
import { HerblistComponent } from '../../layout/content/list/herblist/herblist.component';

const routes: Routes = [
  { path: '', component: HerblistComponent },
  { path: ':id', component: HerbdetailComponent },
  { path: '', redirectTo: '/herbs', pathMatch: 'full' },
  { path: '**', redirectTo: '/herbs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HerbsRoutingModule { }
