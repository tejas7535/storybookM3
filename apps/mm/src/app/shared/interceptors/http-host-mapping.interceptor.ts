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
    const wrongHostPattern =
      /^http:\/\/10\.0\.\d+\.\d+:80\/MountingManager\/v1/;

    if (wrongHostPattern.test(request.url)) {
      const modifiedUrl = request.url.replace(
        wrongHostPattern,
        environment.baseUrl
      );

      const modifiedReq = request.clone({
        url: modifiedUrl,
      });

      return next.handle(modifiedReq);
    }

    return next.handle(request);
  }
}
