import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  constructor(private product:ProductsService, private router:Router) { }
  productinfo= this.product.product;
  ngOnInit() { 
  }

  backToCostumers(){
    this.router.navigateByUrl('home/costumers');
  }

}
