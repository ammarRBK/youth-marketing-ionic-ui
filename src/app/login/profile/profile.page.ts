import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPage } from '../login.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userdata:object;

  constructor(public authServ: AuthService, private platform:Platform, private router: Router) { 
    this.platform.backButton.subscribe(()=>{
      this.authServ.checkLoggedIn().subscribe(res =>{
        res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') :  this.router.navigateByUrl('home/users')
      })
    })
    
  }

  ngOnInit() {
    this.userdata= this.authServ.userDataSer;
    console.log(this.userdata);
  }

  navtoAddPage(){
    this.router.navigateByUrl('home/login/profile/addproduct')
  }

  backToHome(){
    this.router.navigateByUrl('home');
  }

}
