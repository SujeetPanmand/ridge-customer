import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AppConfig } from 'src/app/core/config/app.config';

interface ApiParam {
  data?: any;
  params?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  /**
   * @description a single request method to perform any api operation.
   * It's fully depends on the ApiConfig file.
   * @param name
   * @param param
   */
  request(name: string, param: ApiParam): Observable<any> {
    const endpoint = AppConfig.api.endpoints.find(
      (_endpoint) => _endpoint.name === name
    );

    if (!endpoint) {
      throw new Error('Enpoint with this name not found');
    }

    const apiUrl = this.buildApiUrl(endpoint, param);
    const httpMethod = endpoint.method;
    const httpRequest = {};

    // this.router.navigate(['/home']);

    httpRequest['body'] = param != null ? param['data'] : '';
    httpRequest['headers'] =
      param && param['data'] instanceof FormData
        ? {}
        : { 'content-type': 'application/json' };
    this.loaderService.setLoaderDisplay(true);
    return this.httpClient.request(httpMethod, apiUrl, httpRequest).pipe(
      catchError(this.handleError('apiCall', [])),
      finalize(() => {
        this.loaderService.setLoaderDisplay(false);
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.loaderService.setLoaderDisplay(false);
      if (error.status === 401) {
        localStorage.removeItem('username');
        this.router.navigate(['/account/login']);
      } else if (error.status === 422) {
        return throwError(() => error.error);
      } else if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      }

      // return Observable.throw(error);
      return throwError(() => error.error);
    };
  }

  /**
   * @description builds and replaces the api params in the url
   * @param endpoint
   * @param param
   */
  private buildApiUrl(endpoint: any, param: ApiParam): string {
    // let url = AppConfig.api.baseUrl + endpoint.url;
    let url = endpoint.url;

    if (param) {
      for (const key in param.params) {
        if (param.params.hasOwnProperty(key)) {
          const value = param.params[key];

          url = url.replace('[' + key + ']', value);
        }
      }
    }

    return url;
  }
}
