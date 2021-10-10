import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-costumers',
  templateUrl: './costumers.page.html',
  styleUrls: ['./costumers.page.scss'],
})
export class CostumersPage implements OnInit {

  loggedin:boolean;
  productions: any;

  constructor(private router:Router, private authServ: AuthService, private products: ProductsService) { }

  ngOnInit() {
    this.getProds();
    this.authServ.checkLoggedIn().subscribe(res => {
      res['message']=== "loggedin" ? this.loggedin= true : this.loggedin= false;
    })
  }

  getProds(){
    this.products.getProducts().forEach((elem:any)=>{
      this.productions= elem
    })
  }

  showProductPage(){
    this.router.navigateByUrl('costumers/product');
  }

  routeProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

}
