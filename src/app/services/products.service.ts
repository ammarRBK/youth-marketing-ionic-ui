import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private device: Device, private transferer: FileTransfer) { }
  deviceId= this.device.uuid;
  url= 'https://youth-marketing-server.herokuapp.com/api/';
  httpOptions: object={
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json'
    })
  }

  product;
  status="";

  addProduct(imageUri, productData){
    productData.params.deviceId= this.deviceId
    const filetransfer: FileTransferObject= this.transferer.create();
    return filetransfer.upload(imageUri, encodeURI(this.url+"products/addproduct"), productData)
    // this.http.post(this.url+"products/addproduct",productData,this.httpOptions).pipe(
    //   retry(2),
    //   catchError(this.handleError)
    // )
  }

  getProducts(){
    return this.http.get(this.url+"products/getproducts",this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  getUserProducts(){
    return this.http.post(this.url+"products/getUserProducts",{deviceId:this.deviceId},this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  deleteProduct(product){
    return this.http.post(this.url+'products/deleteproduct',product,this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }


  // set updateUserProducts(productId){

  // }

  // get updateUserProducts(){
  //   return this.getUserProducts().subscribe(res=>{
  //     res['message'] !== "you dont have products yet" ? JSON.parse(res['prods']) : "";
  //   })
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
