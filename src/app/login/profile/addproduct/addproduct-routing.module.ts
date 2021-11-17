import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddproductPage } from './addproduct.page';

const routes: Routes = [
  {
    path: '',
    component: AddproductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddproductPageRoutingModule {}
