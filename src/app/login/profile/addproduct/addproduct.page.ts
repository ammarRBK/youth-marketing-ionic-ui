import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  addinterfaceform: FormGroup
  errormessage= "";
  addedmessage= "";

  constructor(private productsServ: ProductsService, private addformbuilder:FormBuilder, private router:Router, private camera: Camera, private file: File, public actionSheetController:ActionSheetController) { }

  ngOnInit() {
    this.addinterfaceform= this.addformbuilder.group({
      productTitle: ['',[Validators.required, Validators.minLength(3)]],
      productDescription:['',[Validators.required,Validators.minLength(3)]],
      availableUnits:['',[Validators.required, Validators.pattern('ds')]],
      productQuantity:['',[Validators.required, Validators.pattern('d')]],
      expirationDate:['',[Validators.required]],
      productDate:['',[Validators.required]]
    })
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.submitAddProduct(imageData);
    }, (err) => {
      // Handle error
      this.errormessage= "حدث خطأ أثناء اختيار ملف الصورة (الرجاء التأكد من الخطأ واعادة المحاولة)*"
      setTimeout(() => {
        this.errormessage= "";
      }, 3000);
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "اختر مصدر صورة المنتج",
      mode: "ios",
      buttons: [{
        text: 'اختيار من المعرض',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'التقط صورة باستخدام الكاميرا',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'إلغاء',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  // product requirements= ['productTitle','productDescription','productQuantity','availableUnits','productDate','expirationDate','productImage']
  submitAddProduct(imagedata){
    let productdata={
      productTitle: this.addinterfaceform.value.productTitle,
      productDescription: this.addinterfaceform.value.productDescription,
      productQuantity: this.addinterfaceform.value.productQuantity,
      availableUnits: this.addinterfaceform.value.availableUnits,
      productDate: this.addinterfaceform.value.productDate,
      expirationDate: this.addinterfaceform.value.expirationDate,
      productImage: imagedata || null
    }

    this.productsServ.addProduct(productdata).subscribe(result=>{
      if (result['message']=="cannot add the product") {
        this.errormessage= "حدث خطأ ما أثناء اضافة منتجك* \n الرجاء التأكد من البيانات (اسم المنتج يجب أن لا يكون مكرراً والبيانات معبأة بشكل كامل وصحيح)"
        setTimeout(() => {
          this.errormessage= ""
        }, 3000);
      }
      this.addedmessage= "تم إضافة المنتج بنجاح";
      setTimeout(() => {
        this.addinterfaceform.setValue({
          productTitle: null,
          productDescription: null,
          productQuantity: null,
          availableUnits: null,
          productDate: null,
          expirationDate: null
        })

        this.addedmessage= ""
      }, 3000);
    })
  }

  backToProfile(){
    this.router.navigateByUrl("home/login/profile")
  }

}
