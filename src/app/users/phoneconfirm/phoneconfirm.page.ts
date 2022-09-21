import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ProductsService } from '../../services/products.service';
import { UsersPage } from '../users.page';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';

@Component({
  selector: 'app-phoneconfirm',
  templateUrl: './phoneconfirm.page.html',
  styleUrls: ['./phoneconfirm.page.scss'],
})
export class PhoneconfirmPage implements OnInit {
  @Input() phoneNumber:any;
  first:any;
  second:any;
  third:any;
  fourth:any;
  fifth:any;
  sixth:any;
  timer:any= 59;
  errorMessage= '';

  constructor(public modalCtrl: ModalController, private loadingController: LoadingController, private productSer: ProductsService, private toastCtrl: ToastController) { }

  ngOnInit() {
    setInterval(()=>{this.settimer()},1000)
  }

  moveToNext(ev,num){
    if(num !== 'done'){
      ev.target.value ? num.setFocus() : console.log('field');
    }
  }

  settimer(){
    this.timer > 0 ?  this.timer = this.timer-1 : this.timer= '';
  }

  sendCode(){
    var code= Number(''+this.first+this.second+this.third+this.fourth+this.fifth+this.sixth);
    
    window.confirmationResult.confirm(code).then((result)=>{
      if(result){
        this.closeModal()
        UsersPage.returned.next(false);
      }
    }).catch((error)=>{
      this.errorMessage= error;
    })
  }

  resendVerificationCode(){
    this.productSer.loadingProcess('....جارٍ إعادة الرمز')
    const auth= getAuth();
    
    signInWithPhoneNumber(auth, this.phoneNumber ,window.recaptchaVerifier).then(async (confirmationResult)=>{
      window.confirmationResult= confirmationResult;
      const toast=await this.toastCtrl.create({
        message: '                        تم إعادة ارسال الرمز الرجاء إدخاله',
        duration: 3000
      })
      this.loadingController.dismiss()
      toast.present();
    })
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}

