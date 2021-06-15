import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface PutOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  context?: HttpContext;
  responseType?: 'json';
  withCredentials?: boolean;
}
