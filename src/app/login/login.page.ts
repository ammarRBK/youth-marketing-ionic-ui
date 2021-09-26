import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginInterfaceForm: FormGroup;

  constructor(private loginForm:FormBuilder, private loginServe: AuthService) { }
  
  ngOnInit() {
    this.loginInterfaceForm= this.loginForm.group({
      phoneNumber: ['',[Validators.required, Validators.min(9)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/)]]
    })
  }

  submitLogin(){
    let user= this.loginInterfaceForm.value;
    this.loginServe.login(user).subscribe(res=>{
      if (!res) {
        console.log("problem in LOGIN")
      }else{
        console.log(res['message'])
      }
    })
  }

}
