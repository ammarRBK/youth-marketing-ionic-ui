import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { MustMatch } from './_helper';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { PhoneconfirmPage } from './phoneconfirm/phoneconfirm.page';

declare global {
  interface Window { recaptchaVerifier: any;  confirmationResult: any;}
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  interfaceForm: FormGroup;
  district: string;
  block: string;
  houseHold: string;
  formvalidate: object;
  successMessage: string;
  errorMessage: string;

  public static returned: Subject<any>= new Subject();
  constructor(private signupForm: FormBuilder, private signupServ: AuthService, private router: Router, private productsSer: ProductsService, public loadingController: LoadingController, public modalCtrl: ModalController) {
    UsersPage.returned.subscribe(res=>{
      this.submitSignup();
    });
   }

  ngOnInit() {

    const auth= getAuth();
    window.recaptchaVerifier= new RecaptchaVerifier('sendPhone',{
      'size': 'invisible'
    },auth)

    this.signupServ.checkLoggedIn().subscribe(res=>{
      res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') : console.log("not loggedin")
    })


    this.interfaceForm= this.signupForm.group({
      userName: ['',[Validators.required,Validators.minLength(3)]],
      phoneNumber: ['',[Validators.required,Validators.minLength(9), Validators.maxLength(10), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/)]],
      confirmPassword: ['',[Validators.required]],
      district: ['',[Validators.required]],
      block: ['',[Validators.required]],
      houseHold: ['',[Validators.required]],
      email: ['',[Validators.email]]
    },{validator: MustMatch('password', 'confirmPassword')});
    this.formvalidate=this.interfaceForm.controls
  }

  address(){
    return this.interfaceForm.value.district+"-"+this.interfaceForm.value.block+"-HH"+this.interfaceForm.value.houseHold
  }

  sendVerifyCode(phoneNumberElement){
    this.productsSer.loadingProcess('جارِ التحقق من رقم الهاتف');

    var phoneNumber= '+962'+this.interfaceForm.value.phoneNumber;
    const appVerifier = window.recaptchaVerifier;
    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then(async (confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      // window.confirmationResult = confirmationResult;
      const verifyPhone= await this.modalCtrl.create({
        component: PhoneconfirmPage,
        backdropDismiss: true,
        showBackdrop: true,
        componentProps: confirmationResult
      })

      this.loadingController.dismiss()
      await verifyPhone.present();
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      this.errorMessage= "لم يتم إرسال رمز التحقق الرجاء التأكد من رقم الهاتف إعادة الضغط على تأكيد التسجيل";
      setTimeout(() => {
        phoneNumberElement.setFocus()
        this.errorMessage= "";
      }, 3000);
      // ...
    });
  }

  submitSignup(){
    let user={
      userName: this.interfaceForm.value.userName,
      password: this.interfaceForm.value.password,
      phoneNumber: this.interfaceForm.value.phoneNumber,
      address: this.address(),
      email: this.interfaceForm.value.email || null
    }

    this.productsSer.loadingProcess('!....يتم تسجيل الحساب الآن');

    this.signupServ.signup(user).subscribe(response=>{
      if(response['message']==="User saved with hashed password"){
        
        this.loadingController.dismiss()
        this.successMessage= "تهانينا لقد تم تسجيل حسابك لدينا كبائع بإمكانك تسجيل الدخول واضافة منتجاتك"

       setTimeout(() => {
        this.interfaceForm.setValue({
          userName: null,
          password: null,
          confirmPassword: null,
          district: null,
          block: null,
          houseHold: null,
          phoneNumber: null,
          email: null
        });

        this.successMessage= "";
       }, 4000);
      }else{
        this.loadingController.dismiss()
        this.errorMessage= "لقد حدثت مشكلة أثناء تسجيل الحساب الرجاء التأكد من بياناتك و كتابتها بشكل صحيح وإعادة المحاولة"

        setTimeout(() => {
          this.errorMessage= "";
        }, 4000);
      }
    })
  }

  backToHome(){
    this.router.navigateByUrl('/home')
  }
}
