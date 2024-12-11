import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { TranslocoService } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { environment } from '@lsa/environments/environment';

@Injectable()
export class LSALanguageInterceptor implements HttpInterceptor {
  constructor(private readonly translocoService: TranslocoService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(environment.lsaApiBaseUrl)) {
      return next.handle(req);
    }
    const locale = this.translocoService.getActiveLang();

    const modifiedRequest = req.clone({
      headers: req.headers.set('X-LSA-Language', locale),
    });
    return next.handle(modifiedRequest);
  }
}
