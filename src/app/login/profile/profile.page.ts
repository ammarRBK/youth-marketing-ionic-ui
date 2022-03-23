import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
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
  constructor(public authServ: AuthService, private productsSer:ProductsService, private platform:Platform, private router: Router, private loadingController: LoadingController) { 
    
    this.platform.backButton.subscribe(()=>{
      this.router.navigateByUrl('home')
    })

    ProfilePage.returned.subscribe(res=>{
      this.getMyProducts();
    });
    
  }

  ngOnInit() {
    this.getMyProducts();
  }

  getMyProducts(event?){
    this.userdata= "";
    this.products= [];
    this.productsSer.getUserProducts().subscribe(result=>{
      if(result['message'] === "you dont have products yet"){ 
        this.userdata= result['userName'];
        event ? event.target.complete() : 'done';
      // this.clientMessage="إذا كنت ترغب بعرض منتجاتك للزبائن مستخدمين التطبيق قم بإضافتها الى ملفك الشخصي لدينا";
      }else{
        this.products= JSON.parse(result['prods']);
        this.userdata= result['userName'];
        event ? event.target.complete() : 'done';
      }
    })
  }

  logout(){
    this.productsSer.loadingProcess('....يتم تسجيل الخروج');
    this.authServ.logout().subscribe(result=>{
      if(result['message'] === "logged out"){
        setTimeout(() => {
          this.loadingController.dismiss();
          this.backToHome();
        }, 2000);
        
      }
    })
  }

  showproduct(product){
    this.productsSer.productData= product;
    this.productsSer.product['permited']= true;
    // this.productsSer.product= {permited:true, productinfo:product};
    this.router.navigateByUrl('home/costumers/product');
  }

  navtoAddPage(){
    this.router.navigateByUrl('home/login/profile/addproduct')
  }

  navtoEditProfilePage(){
    this.router.navigateByUrl('home/login/profile/edit-profile');
  }

  backToHome(){
    this.router.navigateByUrl('home');
  }

}
