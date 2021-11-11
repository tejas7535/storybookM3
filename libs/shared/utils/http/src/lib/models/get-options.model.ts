import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface GetOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          // eslint-disable-next-line @typescript-eslint/array-type
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
