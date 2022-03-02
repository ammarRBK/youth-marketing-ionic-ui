import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../users/_helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  editProfileForm: FormGroup;
  errorMessage='';
  successMessage='';
  
  constructor(private authServ: AuthService, private router: Router, private formBuilder: FormBuilder) { }

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
  }

}
