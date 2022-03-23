import { Component, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ProductsService } from 'src/app/services/products.service';
import { ModalController, Platform, ActionSheetController, ToastController, LoadingController } from '@ionic/angular';
import {  Camera,CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from "@awesome-cordova-plugins/file/ngx";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { ProfilePage } from 'src/app/login/profile/profile.page';
import { ProductPage } from '../product.page';


@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.page.html',
  styleUrls: ['./editproduct.page.scss'],
})
export class EditproductPage implements OnInit {

  @Input() productTitle: string;
  @Input() productDiscription: string;
  @Input() productQuantity: number;
  @Input() availableUnits: number;
  @Input() productPrice: number;
  @Input() phoneNumber: number
  @Input() productDate: any;
  @Input() expirationDate: any;
  @Input() image: string;
  @Input() imageId: string;
  @Input() userId: number;
  @Input() productOwner: string;
  @Input() productCategory: string;
  @Input() productId: number;

  newImageUrl: string= "";
  newImageId: string= "";
  imageData:any;
  errormessage: string= "";
  editedmessage: string= "";
  validity= 0;
  validateUploadButton: boolean= false;

  editProductForm: FormGroup;
  constructor(private formbuilder: FormBuilder, private productsSer: ProductsService, private router: Router, public productParent: ModalController, private platform: Platform, private actionSheetController: ActionSheetController, private camera: Camera, private toastController: ToastController, private loadingController: LoadingController) {
    this.platform.backButton.subscribe(()=>{
      
      this.productParent.dismiss()
    })
  }

  ngOnInit() {
    this.editProductForm= this.formbuilder.group({
      productTitle: ['',[Validators.minLength(3)]],
      productQuantity: ['',[]],
      productDiscription: ['',[Validators.minLength(5)]],
      availableUnits: ['',[]],
      phoneNumber: ['',[Validators.minLength(9),Validators.maxLength(10)]],
      productPrice: ['',[]]
    })
    this.validateForm()
  }

  submitEditProduct(){
    this.productsSer.loadingProcess('....يتم تعديل بيانات المنتج');
    let newProductData= {
      productId: this.productId,
      productTitle: this.editProductForm.value.productTitle ? this.editProductForm.value.productTitle : this.productTitle,
      productDisciption: this.editProductForm.value.productDiscription ? this.editProductForm.value.productDiscription : this.productDiscription,
      productQuantity: this.editProductForm.value.productQuantity ? this.editProductForm.value.productQuantity : this.productQuantity,
      availableUnits: this.editProductForm.value.availableUnits ? this.editProductForm.value.availableUnits : this.availableUnits,
      productPrice: this.editProductForm.value.productPrice ? this.editProductForm.value.productPrice : this.productPrice,
      phoneNumber: this.editProductForm.value.phoneNumber ? this.editProductForm.value.phoneNumber : this.phoneNumber,
      productDate: this.productDate !== null ? this.productDate : null,
      expirationDate: this.expirationDate !== null ? this.expirationDate : null,
      image: this.newImageUrl !== "" ? this.newImageUrl : this.image,
      imageId: this.newImageId !== "" ? this.newImageId : this.imageId,
      userId: this.userId,
      productOwner: this.productOwner,
      productCategory: this.productCategory
    };

    this.productsSer.editProduct(newProductData).subscribe(resault=>{
      if(resault['message'] === "Product Edited successfully"){
        this.loadingController.dismiss();

        this.editedmessage= "تم تعديل بيانات المنتج بنجاح اذا أردت/ي تعديل الصورة الرجاء الضغط على اختيار الصورة ثم بعد اختيار الصورة ستظهر أيقونة بجانبها لرفع الصورة";
        
        ProfilePage.returned.next(false)

        this.productsSer.productData= resault['product'];

        ProductPage.returned.next(false)
        setTimeout(() => {
          this.editProductForm.setValue({
            productTitle: null,
            productDiscription: null,
            phoneNumber: null,
            productQuantity: null,
            productPrice: null,
            availableUnits: null
          });

          this.editedmessage= "";
        }, 4500);
      }else{
        this.loadingController.dismiss();
        this.errormessage= "لم نتمكن من تعديل البيانات الرجاء التأكد من تعبأتها بشكل صحيح";
        
        setTimeout(() => {
          this.errormessage= ""
        }, 2500);
      }
    })
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
      this.imageData= imageData;
      this.validateUploadButton= true;
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

  uploadNewImage(){
    this.productsSer.loadingProcess('.....يتم رفع الصورة');
    let productOptions: FileUploadOptions={
      fileKey: "productImage",
      fileName: this.imageData.substr(this.imageData.lastIndexOf('/')+1),
      mimeType: 'image/jpeg',
      params: {
        productId: this.productId,
        oldImageId: this.imageId
      }
    }
    this.productsSer.editProductImage(this.imageData, productOptions).then(resault=>{
      if(resault['message'] === "cannot update the image"){
        this.loadingController.dismiss();
        this.errormessage= "لم يتم تحميل الصورة الرجاء المحاولة لاحقاً";

        setTimeout(() => {
          this.errormessage= "";
        }, 2000);
        
      }else{
        this.loadingController.dismiss();
        this.productsSer.productData= resault['product'];
        this.presentToast();
        this.validateUploadButton= false;
        ProductPage.returned.next(false)
        ProfilePage.returned.next(false)
      }
    })
  }

  closeModal(){
    this.productParent.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: '                        تم تحميل صورة المنتج الجديدة بنجاح',
      duration: 3000
    });
    toast.present();
  }

  validateForm(){
    this.editProductForm.valueChanges.subscribe(values=>{
      var lengths= '' + values.productTitle.length + values.productQuantity + values.productDiscription.length + values.availableUnits + values.phoneNumber + values.productPrice
      this.validity= lengths.length;
      
    })
  }

}
