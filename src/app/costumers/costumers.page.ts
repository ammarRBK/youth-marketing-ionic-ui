import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-costumers',
  templateUrl: './costumers.page.html',
  styleUrls: ['./costumers.page.scss'],
})
export class CostumersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showProductPage(){
    console.log("hellow Ammar")
  }

}
