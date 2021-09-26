import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'costumers',
    loadChildren: () => import('../costumers/costumers.module').then( m => m.CostumersPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('../users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
