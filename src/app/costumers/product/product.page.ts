import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController, Platform, ModalController, LoadingController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { ProfilePage } from '../../login/profile/profile.page';
import { EditproductPage } from './editproduct/editproduct.page';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  public static returned: Subject<any> = new Subject();
  constructor(public productsSer:ProductsService, private router:Router, private authServ: AuthService, private alert: AlertController, private platform: Platform, public modalcontroler: ModalController, private callNumber: CallNumber, private loadingController: LoadingController) { 
    this.platform.backButton.subscribe(()=>{
      this.permit ? this.router.navigateByUrl('home/login/profile') : this.router.navigateByUrl('home/costumers');
    })
    ProductPage.returned.subscribe(res=>{
      this.getProductData()
    })
  }
  
  
  // {
  //   productTitle: 'عصيري',
  //   productDisciption: "بنميتبسيتنبتسبيسب",
  //   availableUnits:2,
  //   productQuantity:1,
  //   expirationDate:null,
  //   productDate:null,
  //   productPrice: 3,
  //   image:'../../../assets/logo.png',
  //   productCategory: 'ملابس' ,
  //   phoneNumber: 799883355
  // }
  permit= this.productsSer.product.permited
  productinfo= this.productsSer.productData
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
            this.deleteProduct(this.productinfo['id'], this.productinfo['imageId']);
          }
        }
      ]
    })

    await alerterOptions.present()
  }

  deleteProduct(id, imageId){
    this.productsSer.loadingProcess('....يتم الآن حذف المنتج')
    let product= {
      productId: id,
      imageId: imageId
    }
    this.productsSer.deleteProduct(product).subscribe(async (result)=>{
      const afterDeletAlert= await this.alert.create({
        message: result['message'] === "Product deleted" ? "!!تم حذف المنتج" : "somthing bad happend"
      })
//refresh the Profile page component to call ngOnInit function another time
      ProfilePage.returned.next(false);
      this.loadingController.dismiss();
      await afterDeletAlert.present();

       setTimeout(() => {
        afterDeletAlert.dismiss();
        this.router.navigateByUrl('home/login/profile')
      }, 2000);
    })
  }

  logout(){
    this.authServ.logout().subscribe(result=>{
      this.productsSer.loadingProcess('....يتم تسجيل الخروج')
      if(result['message'] === "logged out"){
        setTimeout(() => {
          this.loadingController.dismiss();
          this.router.navigateByUrl('home');
        }, 2000);
        
      }
    })
  }

  async presentModal(){
    let editproductmodal= await this.modalcontroler.create({
      component: EditproductPage,
      animated: true,
      backdropDismiss: true,
      showBackdrop: true,
      componentProps:{
        productTitle: this.productinfo.productTitle,
        productDiscription: this.productinfo.productDisciption,
        productQuantity: this.productinfo.productQuantity,
        availableUnits: this.productinfo.availableUnits,
        productPrice: this.productinfo.productPrice,
        phoneNumber: this.productinfo.phoneNumber,
        productDate: this.productinfo.productDate,
        expirationDate: this.productinfo.expirationDate,
        image: this.productinfo.image,
        imageId: this.productinfo.imageId,
        userId: this.productinfo.userId,
        productOwner: this.productinfo.productOwner,
        productCategory: this.productinfo.productCategory,
        productId: this.productinfo.id
      }
    })

    return await editproductmodal.present()
  }

  // async getDatafromModal(){
  //   const { data }= await this.editproductmodal.onWillDismiss()
  //   this.productinfo.productTitle= data.productTitle !== "" || data.productTitle !== null ? data.productTitle : this.productinfo.productTitle;
  //   this.productinfo.productDisciption= data.productDiscription !== "" || data.productDiscription !== null ? data.productDiscription : this.productinfo.productDisciption;
  //   this.productinfo.productQuantity= data.productQuantity !== "" || data.productQuantity !== null ? data.productQuantity : this.productinfo.productQuantity;
  //   this.productinfo.availableUnits= data.availableUnits !== "" || data.availableUnits !== null ? data.availableUnits : this.productinfo.availableUnits;
  //   this.productinfo.productPrice= data.productPrice !== "" || data.productPrice !== null ? data.productPrice : this.productinfo.productPrice;
  //   this.productinfo.phoneNumber= data.phoneNumber !== "" || data.phoneNumber !== null ? data.phoneNumber : this.productinfo.phoneNumber;
  //   this.warningAlert();
  // }

  getProductData(){
    this.productinfo= this.productsSer.productData
  }

  openDialer(){
    this.callNumber.callNumber('0798726360', false)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  routeProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

  backward(){
    this.permit ? this.router.navigateByUrl('home/login/profile') : this.router.navigateByUrl('home/costumers');
  }

}
