import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageService } from '../_core/services/storage.service';
import { AlertService } from '../_core/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
const TOKEN_HEADER_KEY = 'Authorization';       // for Spring Boot back-end
// const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: StorageService, private matDialog: MatDialog, private alertToaster: AlertService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // console.log(this.token.getToken());

    let authReq = request;
    const token = this.token.getToken();


    if (token != null) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }

    // console.log(authReq);
    return next.handle(authReq).pipe(
      catchError((error) => {

        let handled: boolean = false;
        if (error instanceof HttpErrorResponse) {

          if (error.error instanceof ErrorEvent) {

          } else {

            switch (error.status) {
              case 401:
                this.token.signOut();
                this.alertToaster.showError("Invalid Credentials,Please Enter valid Username and Password");
                console.log(`redirect to login`);
                this.matDialog.closeAll();
                handled = true;
                break;
              case 403:
                this.token.signOut();
                console.log(`redirect to login`);
                handled = true;
                break;
            }
          }
        } else {
          console.error("Other Errors");
        }

        if (handled) {
          console.log('return back ');
          return of(error);
        } else {
          console.log('throw error back to to the subscriber');
          return throwError(error);
        }

      })
    )
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];