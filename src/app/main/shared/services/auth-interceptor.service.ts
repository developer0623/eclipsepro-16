import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import rg4js from 'raygun4js';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Ams } from 'src/app/amsconfig';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modify the request (e.g., add headers)
    const authReq = req.clone({
      withCredentials: true,
    });

    // Pass the modified request to the next handler
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log error using Raygun (if needed)
        rg4js('send', {
          error: 'Failed HTTP request',
          customData: { rejection: error },
        });

        if (error.status === 401) {
          // Show error message
          this.snackBar.open('Authorization Failed!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });

          // Redirect to login page with redirect URL
          window.location.href = `${
            Ams.Config.BASE_URL
          }/auth/login?redirectUrl=${encodeURIComponent(window.location.href)}`;
        }

        return throwError(() => error);
      })
    );
  }
}
