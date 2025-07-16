import { Injectable } from '@angular/core';

import { from, Observable, Subject } from 'rxjs';

import { MediasID } from '../../types';
import { AvailabilityRequest, CallbackData } from './types';

@Injectable({ providedIn: 'root' })
export class PriceAndAvailabilityService {
  private readonly requests$$ = new Subject<AvailabilityRequest>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly availabilityRequests$$ = this.requests$$.asObservable();

  public fetchAvailabilityInfo(products: MediasID[]): Observable<CallbackData> {
    return from(
      new Promise<CallbackData>((resolve) => {
        const callback = (data: CallbackData) => resolve(data);

        this.requests$$.next({
          details: {
            payload: {
              pimIds: products,
            },
          },
          callback,
        } as AvailabilityRequest);
      })
    );
  }
}
