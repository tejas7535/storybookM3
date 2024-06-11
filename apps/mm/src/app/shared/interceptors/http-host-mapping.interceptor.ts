import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '@mm/environments/environment';

@Injectable()
/**
 * This interceptor is used to map the wrong host to the correct one, till API is fixed.
 */
export class HttpHostMappingInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const wrongURL = 'http://10.0.1.22:80/MountingManager/v1';

    if (request.url.includes(wrongURL)) {
      const modifiedUrl = request.url.replace(wrongURL, environment.baseUrl);

      const modifiedReq = request.clone({
        url: modifiedUrl,
      });

      return next.handle(modifiedReq);
    }

    return next.handle(request);
  }
}
