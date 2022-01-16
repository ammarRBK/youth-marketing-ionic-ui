import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Platform, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private router: Router, private authServ: AuthService,private alert: AlertController, private platform: Platform) { 
    this.platform.backButton.subscribe(()=>{
      this.warningAlert()
    })
  }

  async warningAlert(){
    const alerterOptions= await this.alert.create({
      message: "!!هل ترغب في الخروج من البرنامج",
      buttons:[
        {
          text: "إلغاء",
          role: "cancel"
        },
        {
          text: "!!خروج",
          handler: ()=>{

            App.exitApp();
          }
        }
      ]
    })

    await alerterOptions.present()
  }
  
  users(){
    this.authServ.checkLoggedIn().subscribe(res =>{
      res['message']=== "loggedin" ? this.router.navigateByUrl('home/login/profile') :  this.router.navigateByUrl('home/users')
    })
  }

  costumers(){
    this.router.navigateByUrl('home/costumers')
  }
}
