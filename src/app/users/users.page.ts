import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { MustMatch } from './_helper';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private signupForm: FormBuilder, private signupServ: AuthService, private router: Router) { }

  ngOnInit() {
    this.signupServ.checkLoggedIn().subscribe(res=>{
      res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') : console.log("not loggedin")
    })
    this.interfaceForm= this.signupForm.group({
      userName: ['',[Validators.required,Validators.minLength(3)]],
      phoneNumber: ['',[Validators.required,Validators.minLength(10), Validators.maxLength(14), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
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

  submitSignup(){
    let user={
      userName: this.interfaceForm.value.userName,
      password: this.interfaceForm.value.password,
      phoneNumber: this.interfaceForm.value.phoneNumber,
      address: this.address(),
      email: this.interfaceForm.value.email || null
    }

    this.signupServ.signup(user).subscribe(response=>{
      if(response['successMessage']==="User saved with hashed password"){
        
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
        this.errorMessage= "لقد حدثت مشكلة أثناء تسجيل الحساب الرجاء التأكد من بياناتك و كتابتها بشكل وإعادة المحاولة"

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
