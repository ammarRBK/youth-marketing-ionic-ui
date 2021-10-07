import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  url= 'http://localhost:3000/api/';
  getProducts(){
    this.http.get(this.url+"products/getproducts").pipe(
      
    )
  }
}
