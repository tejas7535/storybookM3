import { HttpInterceptorFn } from '@angular/common/http';

/*
import { Store } from '@ngrx/store';

import { getAccessToken } from '@schaeffler/azure-auth';
*/

export const authInterceptor: HttpInterceptorFn = (req, next) =>
  // @TODO: Get correct Store
  /*
  const accessToken = getAccessToken(Store)
  const request = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` }
  });
  */

  next(req);
