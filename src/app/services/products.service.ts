import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  url= 'http://localhost:3000/api/';
  httpOptions: object={
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json'
    })
  }

  product;

  addProduct(productData){
    return this.http.post(this.url+"products/addproduct",productData,this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  getProducts(){
    return this.http.get(this.url+"products/getproducts",this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  getUserProducts(){
    return this.http.get(this.url+"products/getUserProducts",this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

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
