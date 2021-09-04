import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CostumersPageRoutingModule } from './costumers-routing.module';

import { CostumersPage } from './costumers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CostumersPageRoutingModule
  ],
  declarations: [CostumersPage]
})
export class CostumersPageModule {}
