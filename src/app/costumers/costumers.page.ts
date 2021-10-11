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
  fcol=[];
  scol=[];

  constructor(private router:Router, private authServ: AuthService, private products: ProductsService) { }

  ngOnInit() {
    this.getProds();
    this.authServ.checkLoggedIn().subscribe(res => {
      res['message']=== "loggedin" ? this.loggedin= true : this.loggedin= false;
    })
    
  }

  getProds(){
    this.products.getProducts().forEach((elem:any)=>{
      this.productions= elem;

      for(let i=0; i< this.productions.length; i=i+2){
        this.fcol.push(this.productions[i]);
        this.scol.push(this.productions[i+1]);
      }
    })
  }

  showProductPage(product){
    this.products.product= product;
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

}
