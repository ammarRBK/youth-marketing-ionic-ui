import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ProductsService } from 'src/app/services/products.service';
import { ModalController, Platform } from '@ionic/angular';
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
  errormessage: string= "";
  editedmessage: string= "";
  validity= 0;

  editProductForm: FormGroup;
  constructor(private formbuilder: FormBuilder, private productsSer: ProductsService, private router: Router, public productParent: ModalController, private platform: Platform) {
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
        this.editedmessage= "تم تعديل بيانات المنتج بنجاح اذا أردت/ي تعديل الصورة الرجاء الضغط على اختيار الصورة ثم بعد اختيار الصورة ستظهر أيقونة بجانبها لرفع الصورة";
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
        this.errormessage= "لم نتمكن من تعديل البيانات الرجاء التأكد من تعبأتها بشكل صحيح";
        
        setTimeout(() => {
          this.errormessage= ""
        }, 2500);
      }
    })
  }

  closeModal(){
    this.productParent.dismiss({
      productTitle:this.editProductForm.value.productTitle,
      productDiscription: this.editProductForm.value.productDiscription,
      productQuantity: this.editProductForm.value.productQuantity,
      availableUnits: this.editProductForm.value.availableUnits,
      phoneNumber: this.editProductForm.value.phoneNumber,
      productPrice: this.editProductForm.value.productPrice
    });
    
    ProductPage.returned.next(false);
  }

  validateForm(){
    this.editProductForm.valueChanges.subscribe(values=>{
      var lengths= '' + values.productTitle.length + values.productQuantity + values.productDiscription.length + values.availableUnits + values.phoneNumber + values.productPrice
      this.validity= lengths.length;
      
    })
  }

}
