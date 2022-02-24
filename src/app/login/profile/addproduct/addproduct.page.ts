import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {  Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from "@awesome-cordova-plugins/file/ngx";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
import { ProductsService } from 'src/app/services/products.service';
import { ProfilePage } from '../profile.page';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})


export class AddproductPage implements OnInit {
  
  addinterfaceform: FormGroup;
  errormessage= "";
  addedmessage= "";
  currency= "";
  imageUri;
  fileName= "";
  productCategories=["مواد غذائية تصنيع معامل" 
  , "مواد غذائية صنع منزلي" 
  , "ملابس" 
  , "حرف يدوية" 
  , "صوف"
  , "أدوات منزلية"];

  constructor(private productsServ: ProductsService, private addformbuilder:FormBuilder, private router:Router, private camera:Camera, public actionSheetController:ActionSheetController, private platform: Platform, private file:File) { 
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
      productImage:['',[]],
      productCategory: ['',[Validators.required]]
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
      // this.picData= "this is the blobl ):" + imageData;
      // let imageName= "";
      //new Date().toDateString() + Math.random().toString() + '.jpeg';
      // const imageBlob = this.dataURItoBlob(imageData);
      // const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });

      // this.file.resolveLocalFilesystemUrl(imageData).then(fileEntry=>{
      //   let { name, nativeURL } = fileEntry;

      //     // get the path..
      //   let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
      //   imageName= name;
      //   this.file.readAsArrayBuffer(path,name).then(buffered=>{
      //   let imageBlob= new Blob([buffered],{type: 'image/jpeg'});

      //     setTimeout(()=>{
      //       this.picData= imageBlob.size;
      //     },2000)
          
          
      //   })
      // })
      // this.makeFileIntoBlob(imageData).then(data=>{
        
      //   this.picData="this is the file blob \n" + JSON.stringify(data);
      // })

      // this.addinterfaceform.patchValue({
      //   productImage: null
      // },{
      //   onlySelf:true
      // });
      this.imageUri= imageData
      this.fileName= imageData.substr(imageData.lastIndexOf('/')+1).split("?")[0];
      
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
      productPrice: this.addinterfaceform.value.productPrice,
      productCategory: this.addinterfaceform.value.productCategory
    }

    // this.productsServ.addProduct(productdata).subscribe(result=>{
    //   if (result['message']=="cannot add the product") {
    //     this.errormessage= "حدث خطأ ما أثناء اضافة منتجك* \n الرجاء التأكد من البيانات (اسم المنتج يجب أن لا يكون مكرراً والبيانات معبأة بشكل كامل وصحيح)"
    //     setTimeout(() => {
    //       this.errormessage= ""
    //     }, 3000);
    //   }else{
    //     this.addedmessage= "تم إضافة المنتج بنجاح";
    //     setTimeout(() => {
    //       this.addinterfaceform.setValue({
    //         productTitle: null,
    //         productDescription: null,
    //         productQuantity: null,
    //         availableUnits: null,
    //         productDate: null,
    //         expirationDate: null,
    //         productPrice: null
    //       })

    //       this.addedmessage= ""
    //     }, 3000);
    //   }
      
    // })
    let productOptions: FileUploadOptions={
      fileKey: "productImage",
      fileName: this.imageUri.substr(this.imageUri.lastIndexOf('/')+1),
      mimeType: 'image/jpeg',
      params: productdata
    }

    this.productsServ.addProduct(this.imageUri, productOptions).then(result =>{
      if (result['message']=="cannot add the product") {
            this.errormessage= "حدث خطأ ما أثناء اضافة منتجك* \n الرجاء التأكد من البيانات (اسم المنتج يجب أن لا يكون مكرراً والبيانات معبأة بشكل كامل وصحيح)"
            setTimeout(() => {
              this.errormessage= ""
            }, 3000);
          }else{
            this.fileName= "";
            this.addedmessage= "تم إضافة المنتج بنجاح";
//refresh the Profile page component to call ngOnInit function another time
            ProfilePage.returned.next(false);
            setTimeout(() => {
              this.addinterfaceform.setValue({
                productTitle: null,
                productDescription: null,
                productQuantity: null,
                availableUnits: null,
                productDate: null,
                expirationDate: null,
                productPrice: null,
                productImage: null,
                productCategory: null
              })
              
              this.addedmessage= "";
            }, 2000);
          }
    }).catch(error=>{
        this.errormessage= "حدث خطأ ما أثناء اضافة منتجك* \n الرجاء التأكد من البيانات (اسم المنتج يجب أن لا يكون مكرراً والبيانات معبأة بشكل كامل وصحيح)"
        setTimeout(() => {
          this.errormessage= ""
        }, 4000);
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

  // makeFileIntoBlob(_imagePath) {
  //   // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
  //   return new Promise((resolve, reject) => {
  //     let fileName = "";
  //     this.file
  //       .resolveLocalFilesystemUrl(_imagePath)
  //       .then(fileEntry => {
  //         let { name, nativeURL } = fileEntry;

  //         // get the path..
  //         let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));

  //         fileName = name;

  //         // we are provided the name, so now read the file into a buffer
  //         return this.file.readAsArrayBuffer(path, name);
  //       })
  //       .then(buffer => {
  //         // get the buffer and make a blob to be saved
  //         let imgBlob = new Blob([buffer], {
  //           type: "image/jpeg"
  //         });
          
  //         // pass back blob and the name of the file for saving
  //         // into fire base
  //         resolve({
  //           fileName,
  //           imgBlob
  //         });
  //       })
  //       .catch(e => reject(e));
  //   });
  // }

  // dataURItoBlob(dataURI) {
  //   // convert base64 to raw binary data held in a string
  //   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  //   var byteString = atob(dataURI.split(',')[1]);
  
  //   // separate out the mime component
  //   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
  //   // write the bytes of the string to an ArrayBuffer
  //   var ab = new ArrayBuffer(byteString.length);
  
  //   // create a view into the buffer
  //   var ia = new Uint8Array(ab);
  
  //   // set the bytes of the buffer to the correct values
  //   for (var i = 0; i < byteString.length; i++) {
  //       ia[i] = byteString.charCodeAt(i);
  //   }
  
  //   // write the ArrayBuffer to a blob, and you're done
  //   var blob = new Blob([ab], {type: mimeString});
  //   return blob;
  
  // }

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

