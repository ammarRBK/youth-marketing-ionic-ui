import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhoneconfirmPageRoutingModule } from './phoneconfirm-routing.module';

import { PhoneconfirmPage } from './phoneconfirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhoneconfirmPageRoutingModule
  ],
  declarations: [PhoneconfirmPage]
})
export class PhoneconfirmPageModule {}
