import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../users/_helper';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  editProfileForm: FormGroup;
  errorMessage='';
  successMessage='';
  filled: boolean;
  oldPasswordCorrect: boolean;

  constructor(private authServ: AuthService,private prodsSer: ProductsService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editProfileForm= this.formBuilder.group({
      userName: ['',[Validators.minLength(3)]],
      password: ['',[Validators.minLength(8), Validators.pattern(/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/)]],
      confirmPassword: ['',[Validators.minLength(8)]],
      phoneNumber: ['',[Validators.minLength(9),Validators.maxLength(14)]],
      email: ['',[Validators.email]],
      oldPassword: ['',[Validators.required, Validators.minLength(8)]]
    },
    {validator: MustMatch('password', 'confirmPassword')})

    this.formValuesAsString();
  }

  submitEditForm(){
    if(this.oldPasswordCorrect){
      let newData={
        newUserName: this.editProfileForm.value.userName.length > 0 ? this.editProfileForm.value.userName : "",
        newPhoneNumber: this.editProfileForm.value.phoneNumber ? this.editProfileForm.value.phoneNumber : "",
        newPassword: this.editProfileForm.value.password.length > 0 ? this.editProfileForm.value.password : "",
        newEmail: this.editProfileForm.value.email.length > 0 ? this.editProfileForm.value.email : null,
        oldPassword: this.editProfileForm.value.oldPassword
      }

      this.authServ.editProfile(newData).subscribe(resault=>{
        if(resault['message'] === 'updated user info'){
          this.successMessage= "تم تعديل المعلومات الشخصية"

          setTimeout(() => {
            this.editProfileForm.setValue({
              userName: null,
              password: null,
              confirmPassword: null,
              phoneNumber: null,
              email: null,
              oldPassword: null
            })
            document.getElementById("checkButton").style.color= "secondary";
            this.successMessage= "";
          }, 3000);
        }else{
          this.errorMessage= "حصل خطأ أثناء تعديل المعلومات تأكد من كتابتها بالصيغة الصحيحة";

          setTimeout(() => {
            this.errorMessage= "";
          }, 2500);
        }
      })
    }
  }
  
  checkOldPassword(oldPassword){
    this.authServ.checkOldPassword(oldPassword).subscribe(resault=>{
      if(resault['message'] === "authintecated"){ 
        this.oldPasswordCorrect= true;
        this.successMessage= "تم التأكد من كلمة السر"
        document.getElementById("checkButton").style.color= "success";
        setTimeout(() => {
          this.successMessage="";
        }, 1500);
      }else{
        this.oldPasswordCorrect= false;
        this.errorMessage= "الرجاء التأكد من كلمة السر*";

        setTimeout(()=>{
          this.errorMessage= ""
        },2000)
      }
    })
  }

  formValuesAsString(){
    this.editProfileForm.valueChanges.subscribe(values=>{
      let formString= ''+ values.userName+ values.password+ values.confirmPassword+ values.phoneNumber+ values.email;
      formString.length > 0 && values.oldPassword ? this.filled= true : this.filled= false;
    })
    
  }

  backToProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

}
