import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface GetOptions {
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
  context?: HttpContext;
  reportProgress?: boolean;
  responseType?: 'json' | 'text';
  withCredentials?: boolean;
}
