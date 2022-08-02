
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { InformationsService } from '../informations.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class Bonlivraison {
 
    httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(private httpClient: HttpClient) { }


    GetBonLivraison(): Observable<any> {
        let API_URL = `http://erp.b2bservices.tn/bonLivraisons/getById/62d5098c578e2d727c4dec24`;
           return this.httpClient.get(API_URL, { headers: this.httpHeaders })
             .pipe(map((res: any) => {
           
                console.log("res",res)
                
                return res || {}
             }),
             catchError(this.handleError)
             )
        }
        



         // Error 
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
