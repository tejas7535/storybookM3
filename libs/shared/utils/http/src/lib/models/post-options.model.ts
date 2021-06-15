import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface PostOptions {
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
  responseType?: 'json';
  context?: HttpContext;
  withCredentials?: boolean;
}
