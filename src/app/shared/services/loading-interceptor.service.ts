import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptorService implements HttpInterceptor {
  counter = 0;
  constructor(private loadingService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.show();
    this.counter++;

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.counter--;
        }
        if (this.counter <= 0) {
          this.loadingService.hide();
        }
      }),
      catchError((err) => {
        this.counter--;
        this.loadingService.hide();
        throw err;
      })
    );
  }
}
