import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhoneconfirmPage } from './phoneconfirm.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneconfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneconfirmPageRoutingModule {}
