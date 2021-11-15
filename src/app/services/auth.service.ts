import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(private http: HttpClient) { }

  user: object;
  url= 'http://localhost:3000/api/';
  httpOptions: object={
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json'
    })
  }
  
  set userDataSer(userdata){
    this.user=userdata;
  }

  get userDataSer(){
    return this.user;
  }

  signup(userData: object):Observable<{}>{
    return this.http.post(this.url+"users/signup",userData,this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError));
  }

  login(userData: object):Observable<{}>{
    return this.http.post(this.url+"users/signin",userData,this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError));
  }

  checkLoggedIn(){
    return this.http.get(this.url+'users/checkloggedin',this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError));
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
