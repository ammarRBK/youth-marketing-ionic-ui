import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-costumers',
  templateUrl: './costumers.page.html',
  styleUrls: ['./costumers.page.scss'],
})
export class CostumersPage implements OnInit {

  loggedin:boolean;

  constructor(private router:Router, private authServ: AuthService) { }

  ngOnInit() {
    this.authServ.checkLoggedIn().subscribe(res => {
      res['message']=== "loggedin" ? this.loggedin= true : this.loggedin= false;
    })
  }

  showProductPage(){
    console.log("hellow Ammar")
  }

  routeProfile(){
    this.router.navigateByUrl('home/login/profile');
  }

}
