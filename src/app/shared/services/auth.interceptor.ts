import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers
          .set('Authorization', 'Bearer ' + token)
          .set('Cache-Control', 'no-cache')
          .set('Pragma', 'no-cache')
          .set('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT')
          .set('If-Modified-Since', '0'),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
