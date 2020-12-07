import { HttpHeaders, HttpParams } from '@angular/common/http';

export class DeleteOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  body?: any;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
