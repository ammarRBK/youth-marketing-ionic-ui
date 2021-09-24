import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from './_helper';
import { AuthService } from '../services/auth.service';

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

  constructor(private signupForm: FormBuilder, private signupServ: AuthService) { }

  ngOnInit() {
    this.interfaceForm= this.signupForm.group({
      userName: ['',[Validators.required,Validators.minLength(3)]],
      phoneNumber: ['',[Validators.required, Validators.minLength(9), Validators.maxLength(10), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/)]],
      confirmPassword: ['',[Validators.required]],
      district: ['',[Validators.required]],
      block: ['',[Validators.required]],
      houseHold: ['',[Validators.required]]
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
      address: this.address()
    }
    console.log(user)
    this.signupServ.signup(user).subscribe(response=> console.log(response))
  }

}
