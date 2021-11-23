import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userdata:object;
  clientMessage:string;
  products=[];

  constructor(public authServ: AuthService, private productsSer:ProductsService, private platform:Platform, private router: Router) { 
    this.platform.backButton.subscribe(()=>{
      this.authServ.checkLoggedIn().subscribe(res =>{
        res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') :  this.router.navigateByUrl('home/users')
      })
    })
    
  }

  ngOnInit() {
    this.userdata= this.authServ.userDataSer;
    this.productsSer.getUserProducts().subscribe(result=>{
      result['message'] === "you dont have products yet" ? 
      this.clientMessage="إذا كنت ترغب بعرض منتجاتك للزبائن مستخدمين التطبيق قم بإضافتها الى ملفك الشخصي لدينا" 
      : this.products= JSON.parse(result['prods']);
    })
  }

  showproduct(product){
    this.productsSer.product= {permited:true, productinfo:product};
    this.router.navigateByUrl('home/costumers/product');
  }

  navtoAddPage(){
    this.router.navigateByUrl('home/login/profile/addproduct')
  }

  backToHome(){
    this.router.navigateByUrl('home');
  }

}
