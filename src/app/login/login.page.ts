import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginInterfaceForm: FormGroup;
  errorMessage: string;
  userProfileData: object;

  constructor(private loginForm:FormBuilder, public loginServe: AuthService, private navCtrl: NavController, private router: Router) { }
  
  ngOnInit(){
    this.loginInterfaceForm= this.loginForm.group({
      phoneNumber: ['',[Validators.required, Validators.min(9)]],
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
    let user= this.loginInterfaceForm.value;
    this.loginServe.login(user).subscribe(res=>{
      if (!res) {
        console.log("problem in LOGIN")
      }else{
        if(res['message']=== "user Authintecated"){
          
          this.loginServe.userDataSer= res['user'];
          this.errorMessage='';
          this.router.navigateByUrl('home/login/profile');

        }if(res['message']=== "wrong password"){
          this.errorMessage= 'كلمة السر خاطئة الرجاء التأكد من كلمة السر*';
        }else{
          this.errorMessage= 'رقم الهاتف خاطئ أو المستخدم غير مسجل لدينا الرجاء التأكد من رقم الهاتف* ';
        }
      }
    })
  }

  backToSignup(){
    this.router.navigateByUrl('home/users')
  }

}
