import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  constructor(private product:ProductsService, private router:Router, private authServ: AuthService, private alert: AlertController) { }
  productinfo= this.product.product.productinfo;
  permit= this.product.product.permited
  loggedin: boolean;
  ngOnInit() { 
    this.authServ.checkLoggedIn().subscribe(res => {
      res['message']=== "loggedin" ? this.loggedin= true : this.loggedin= false;
    })
  }

  async warningAlert(){
    const alerterOptions= await this.alert.create({
      header: "!!تأكيد الحذف",
      message: "هل ترغب حقاً في حذف منتجك؟ <br/> !!اذا حذفته لن يمكنك استعادته",
      cssClass: "myalert",
      buttons:[
        {
          text: "إلغاء",
          role: "cancel"
        },
        {
          text: "تأكيد الحذف",
          cssClass: "deletealert",
          handler: ()=>{
            console.log(this.productinfo['id'])
            this.deleteProduct(this.productinfo['id']);
          }
        }
      ]
    })

    await alerterOptions.present()
  }

  deleteProduct(id){
    let product= {
      productId: id
    }
    this.product.deleteProduct(product).subscribe(async (result)=>{
      const afterDeletAlert= await this.alert.create({
        message: result['message'] === "Product deleted" ? "!!تم حذف المنتج" : "somthing bad happend"
      })
      await afterDeletAlert.present();

       setTimeout(() => {
        afterDeletAlert.dismiss();
        this.router.navigateByUrl('home/login/profile')
      }, 3000);
    })
  }

  routeProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

  backward(){
    this.permit ? this.router.navigateByUrl('home/login/profile') : this.router.navigateByUrl('home/costumers');
  }

}
