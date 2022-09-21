import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginInterfaceForm: FormGroup;
  errorMessage: string;
  userProfileData: object;

  constructor(private loginForm:FormBuilder, public loginServe: AuthService, private navCtrl: NavController, private router: Router, private productsSer: ProductsService, public loadingController: LoadingController) { }
  
  ngOnInit(){
    this.loginInterfaceForm= this.loginForm.group({
      phoneNumber: ['',[Validators.required, Validators.minLength(9), Validators.maxLength(14)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/)]]
    });
    
    this.loginServe.checkLoggedIn().subscribe(res=>{
      if(res['message']=== "loggedin"){
      this.router.navigateByUrl('home/login/profile')
      }
      console.log("not loggedin")
    })
    
  }

  submitLogin(){
    this.productsSer.loadingProcess('!!...يتم الآن تسجيل الدخول الرجاء الانتظار')
    let user= this.loginInterfaceForm.value;
    this.loginServe.login(user).subscribe(res=>{
      if (!res) {
        this.loadingController.dismiss()
        console.log("problem in LOGIN")
      }else{
        if(res['message']=== "user Authintecated"){
          console.log(res['user'])
          this.userProfileData= res['user'];
          this.errorMessage='';
          this.loadingController.dismiss()
          this.router.navigateByUrl('home/login/profile');

        }if(res['message']=== "wrong password"){
          this.loadingController.dismiss()
          this.errorMessage= 'كلمة السر خاطئة الرجاء التأكد من كلمة السر*';
          setTimeout(() => {
            this.errorMessage= ""
          }, 3000);
          }else{
            if (res['message'] === "user is not in database") {
              this.loadingController.dismiss()
              this.errorMessage= 'رقم الهاتف خاطئ أو المستخدم غير مسجل لدينا الرجاء التأكد من رقم الهاتف* ';
              setTimeout(() => {
                this.errorMessage= ""
              }, 3000);
            } else {
              this.loadingController.dismiss()
              this.errorMessage= res['message'] + '\n' + "Error: " + res['error'];
              setTimeout(() => {
                this.errorMessage= ""
              }, 3000);
          }
        }
      }
    })
  }

  backToSignup(){
    this.router.navigateByUrl('home/users')
  }

}
