import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private authServ: AuthService, private platform:Platform, private router: Router) { 
    this.platform.backButton.subscribe(()=>{
      this.authServ.checkLoggedIn().subscribe(res =>{
        res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') :  this.router.navigateByUrl('home/users')
      })
    })
  }

  ngOnInit() {
  }

}
