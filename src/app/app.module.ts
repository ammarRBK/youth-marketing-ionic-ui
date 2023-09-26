import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from "@awesome-cordova-plugins/file/ngx";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { ProductsService } from './services/products.service';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@NgModule({
  declarations: [AppComponent],
  
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  Camera,
  Device,
  ProductsService,
  File,
  FileTransfer,
  FileTransferObject,
  CallNumber],
  bootstrap: [AppComponent],
})
export class AppModule {}
