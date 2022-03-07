import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.page.html',
  styleUrls: ['./editproduct.page.scss'],
})
export class EditproductPage implements OnInit {

  @Input() productTitle: string;
  @Input() productDiscription: string;
  @Input() productQuantity;
  @Input() availableUnits;
  @Input() productPrice;
  @Input() phoneNumber

  editProductForm: FormGroup;
  constructor(private formbuilder: FormBuilder, private productsSer: ProductsService, private router: Router) { }

  ngOnInit() {
    this.editProductForm= this.formbuilder.group({
      productTitle: ['',[Validators.minLength(3)]],
      productQuantity: ['',[]],
      productDiscription: ['',[Validators.minLength(5)]],
      availableUnits: ['',[]],
      phoneNumber: ['',[Validators.minLength(9),Validators.maxLength(10)]],
      productPrice: ['',[]]
    })
  }

}
