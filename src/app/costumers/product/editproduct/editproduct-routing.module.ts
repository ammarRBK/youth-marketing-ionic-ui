import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditproductPage } from './editproduct.page';

const routes: Routes = [
  {
    path: '',
    component: EditproductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditproductPageRoutingModule {}
