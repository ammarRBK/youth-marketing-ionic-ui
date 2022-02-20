import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private splashscreen: SplashScreen, private platform: Platform) {}
  ngOnInit(){
    this.platform.ready().then(()=>{
      this.splashscreen.hide();
    })
    
  }
}
