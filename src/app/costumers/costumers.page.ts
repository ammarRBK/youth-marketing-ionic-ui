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

  constructor(private router:Router, private authServ: AuthService, private products: ProductsService, private platform: Platform) { 
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

  getProds(){
    this.products.getProducts().forEach((elem:any)=>{

      elem.length > 0 ? this.productions= elem : this.productions=[];
    })
  }

  showProductPage(product){
    this.products.product= {permited:false, productinfo:product};
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
        title.toLowerCase().indexOf(inputSearch) === -1 ? card.style.display="none" : card.style.display="block";
      })
    })
  }

  filterCategory(event){
    let filterValue= event.srcElement.value;
    let cards= Array.from(document.querySelectorAll('ion-card'));
    
    requestAnimationFrame(()=>{
      cards.forEach(card=>{
        let category= card.children[2].children[1].children[1].textContent
        category.indexOf(filterValue) === -1 ? card.style.display="none" : card.style.display="block";
      })
    })
  }

}
