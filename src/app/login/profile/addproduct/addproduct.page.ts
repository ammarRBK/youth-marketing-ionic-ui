import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  addinterfaceform: FormGroup
  croppedImagePath = "";

  constructor(private addformbuilder:FormBuilder, private router:Router, private camera: Camera, private file: File, public actionSheetController:ActionSheetController) { }

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
      this.croppedImagePath = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "اختر مصدر صورة المنتج",
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
  submitAddProduct(){
    
  }

  backToProfile(){
    this.router.navigateByUrl("home/login/profile")
  }

}
