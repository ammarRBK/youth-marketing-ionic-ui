import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CostumersPage } from './costumers.page';

const routes: Routes = [
  {
    path: '',
    component: CostumersPage
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.module').then( m => m.ProductPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostumersPageRoutingModule {}
