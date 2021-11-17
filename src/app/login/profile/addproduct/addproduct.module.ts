import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddproductPageRoutingModule } from './addproduct-routing.module';

import { AddproductPage } from './addproduct.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddproductPageRoutingModule
  ],
  declarations: [AddproductPage]
})
export class AddproductPageModule {}
