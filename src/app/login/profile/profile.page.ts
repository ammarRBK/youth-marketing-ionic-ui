import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import { LoginPage } from '../login.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  login: LoginPage;
  clientMessage:string;
  products=[];
  userdata: string;
  public static returned: Subject<any> = new Subject();
  constructor(public authServ: AuthService, private productsSer:ProductsService, private platform:Platform, private router: Router) { 
    
    this.platform.backButton.subscribe(()=>{
      if(!this.userdata){
        this.router.navigateByUrl('home')
      }
      this.router.navigateByUrl('home/users')
    })

    ProfilePage.returned.subscribe(res=>{
      this.getMyProducts();
    });
    
  }

  ngOnInit() {
    this.getMyProducts();
  }

  getMyProducts(){
    this.productsSer.getUserProducts().subscribe(result=>{
      if(result['message'] === "you dont have products yet"){ 
        this.userdata= result['userName'];
      // this.clientMessage="إذا كنت ترغب بعرض منتجاتك للزبائن مستخدمين التطبيق قم بإضافتها الى ملفك الشخصي لدينا";
      }else{
        this.products= JSON.parse(result['prods']);
        this.userdata= result['userName'];
      }
    })
  }

  logout(){
    this.authServ.logout().subscribe(result=>{
      if(result['message'] === "logged out"){
        this.backToHome();
      }
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
