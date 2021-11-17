import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {

  addinterfaceform: FormGroup

  constructor(private addformbuilder:FormBuilder, private router:Router) { }

  ngOnInit() {
    this.addinterfaceform= this.addformbuilder.group({

    })
  }

  // product requirements= ['productTitle','productDiscription','productQuantity','availableUnits','productDate','expirationDate']
  submitAddProduct(){
    
  }

}
