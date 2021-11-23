import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  constructor(private product:ProductsService, private router:Router, private authServ: AuthService) { }
  productinfo= this.product.product.productinfo;
  permit= this.product.product.permited
  loggedin: boolean;
  ngOnInit() { 
    this.authServ.checkLoggedIn().subscribe(res => {
      res['message']=== "loggedin" ? this.loggedin= true : this.loggedin= false;
    })
  }

  routeProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

  backward(){
    this.permit ? this.router.navigateByUrl('home/login/profile') : this.router.navigateByUrl('home/costumers');
  }

}
