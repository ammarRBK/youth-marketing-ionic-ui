import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
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
  fcol=[];
  scol=[];
  productCategories;
  productionsLength= 0;

  constructor(private router:Router, private authServ: AuthService, public products: ProductsService, private platform: Platform) { 
    this.productCategories= this.products.productCategories;

    this.platform.backButton.subscribe(()=>{
      
      this.router.navigateByUrl('home');
    })
  }

  ngOnInit() {
    this.getProds();
    this.authServ.checkLoggedIn().subscribe(res => {
      res['message']=== "loggedin" ? this.loggedin= true : this.loggedin= false;
    })
    
  }

  getProds(event?){
    this.productionsLength= 0;
    this.products.getProducts().forEach((elem:any)=>{
      if (elem.length > 0) {
        this.productions= elem;
        this.productionsLength= elem.length;
        event ? event.target.complete() : 'done';
      } else {
        this.productions= [];
        this.productionsLength= 1;
        event ? event.target.complete() : 'done';
      }
    })
  }

  // doRefresh(event){
  //   this.getProds();
  //   event.target.complete();
  // }

  showProductPage(product){
    this.products.productData= product;
    this.products.product['permited']= false;
    this.router.navigateByUrl('costumers/product');
  }

  routeProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

  backToHome(){
    this.router.navigateByUrl('home');
  }


  handleText(event){
    let eventValue= event.srcElement.value;
    let inputSearch= eventValue.toLowerCase();
    let cards= Array.from(document.querySelectorAll('ion-card'));
    
    requestAnimationFrame(()=>{
      cards.forEach(card=>{
        let title= card.children[1].children[0].textContent
        let productOwner= card.children[2].children[0].textContent
        title.toLowerCase().indexOf(inputSearch) === -1 && productOwner.toLowerCase().indexOf(inputSearch) === -1 ? card.style.display="none" : card.style.display="block";
      })
    })
  }

  filterCategory(event){
    let filterValue= event.srcElement.value;
    let cards= Array.from(document.querySelectorAll('ion-card'));
    
    requestAnimationFrame(()=>{
      cards.forEach(card=>{
        if (filterValue != null && filterValue != "") {
          let category= card.children[1].children[1].textContent
          category != filterValue ? card.style.display="none" : card.style.display="block";
        } else {
          card.style.display="block"
        }
        
      })
    })
  }

}
