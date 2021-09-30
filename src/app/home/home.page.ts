import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router, private authServ: AuthService) {}
  
  users(){
    this.authServ.checkLoggedIn().subscribe(res =>{
      res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') :  this.router.navigateByUrl('home/users')
    })
  }

  costumers(){
    this.router.navigateByUrl('home/costumers')
  }
}
