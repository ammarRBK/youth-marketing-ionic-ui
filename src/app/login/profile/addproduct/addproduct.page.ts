import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
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
  currency= "";

  constructor(private productsServ: ProductsService, private addformbuilder:FormBuilder, private router:Router, private camera:Camera, public actionSheetController:ActionSheetController, private platform: Platform) { 
    this.platform.backButton.subscribe(()=>{
      
      this.router.navigateByUrl('home/login/profile')
    })
  }

  ngOnInit() {
    this.addinterfaceform= this.addformbuilder.group({
      productTitle: ['',[Validators.required, Validators.minLength(3)]],
      productDescription:['',[Validators.required,Validators.minLength(3)]],
      availableUnits:['',[Validators.required]],
      productQuantity:['',[Validators.required]],
      expirationDate:['',[Validators.required]],
      productDate:['',[Validators.required]],
      productPrice: ['',[Validators.required]],
      productImage:['',[]]
    })
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {

      let imageName= new Date().toDateString() + Math.random().toString() + '.jpeg';
      const imageBlob = this.productsServ.dataURItoBlob(imageData);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

      this.addinterfaceform.setValue({
        productImage: imageFile
      })
    }, (err) => {
      // Handle error
      this.errormessage= err === "cordova_not_available" 
      ? "الرجاء استخدام هاتف جوال لالتقاط او اختيار صورة للمنتج*" 
      : err;
      // "حدث خطأ أثناء اختيار ملف الصورة (الرجاء التأكد من الخطأ واعادة المحاولة)*"
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

  // product requirements= ['productTitle','productDescription','productQuantity','availableUnits','productDate','expirationDate','productImage','productPrice']
  submitAddProduct(){
    let productdata={
      productTitle: this.addinterfaceform.value.productTitle,
      productDescription: this.addinterfaceform.value.productDescription,
      productQuantity: this.addinterfaceform.value.productQuantity,
      availableUnits: this.addinterfaceform.value.availableUnits,
      productDate: this.addinterfaceform.value.productDate,
      expirationDate: this.addinterfaceform.value.expirationDate,
      productImage: this.addinterfaceform.value.productImage,
      productPrice: this.addinterfaceform.value.productPrice
    }

    this.productsServ.addProduct(productdata).subscribe(result=>{
      if (result['message']=="cannot add the product") {
        this.errormessage= "حدث خطأ ما أثناء اضافة منتجك* \n الرجاء التأكد من البيانات (اسم المنتج يجب أن لا يكون مكرراً والبيانات معبأة بشكل كامل وصحيح)"
        setTimeout(() => {
          this.errormessage= ""
        }, 3000);
      }else{
        this.addedmessage= "تم إضافة المنتج بنجاح";
        setTimeout(() => {
          this.addinterfaceform.setValue({
            productTitle: null,
            productDescription: null,
            productQuantity: null,
            availableUnits: null,
            productDate: null,
            expirationDate: null,
            productPrice: null
          })

          this.addedmessage= ""
        }, 3000);
      }
      
    })
  }

  formatToCurrency(event){
    let uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:'JOD'}).format(event.target.value);
    this.currency= uy;
    // this.addinterfaceform.setValue({
    //   productPrice: uy
    // })
  }

  backToProfile(){
    this.router.navigateByUrl("home/login/profile")
  }

}

// image;
//  imageData;
// constructor(private camera: Camera,
//         private http: HttpClient) { }
//   ngOnInit() {
//   }

//   openCamera(){
//     const options: CameraOptions = {
//     quality: 100,
//     destinationType: this.camera.DestinationType.DATA_URL,
//     encodingType: this.camera.EncodingType.JPEG,
//     mediaType: this.camera.MediaType.PICTURE,
//    }

//     this.camera.getPicture(options).then((imageData) => {
//     this.imageData = imageData;
//     this.image=(<any>window).Ionic.WebView.convertFileSrc(imageData);
//     }, (err) => {
//        // Handle error
//        alert("error "+JSON.stringify(err))
//   });
// }
//   upload(){
//     let  url = 'your REST API url';
//     const date = new Date().valueOf();

//     // Replace extension according to your media type
//     const imageName = date+ '.jpeg';
//     // call method that creates a blob from dataUri
//     const imageBlob = this.dataURItoBlob(this.imageData);
//     const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' })

//     let  postData = new FormData();
//     postData.append('file', imageFile);

//     let data:Observable<any> = this.http.post(url,postData);
//     data.subscribe((result) => {
//       console.log(result);
//     });
//   }

