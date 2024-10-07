/* eslint-disable import/no-extraneous-dependencies */
import { Injectable } from '@angular/core';

import {
  from,
  interval,
  Observable,
  Subject,
  switchMap,
  takeWhile,
} from 'rxjs';

import {
  AdvertisingId,
  AdvertisingStatus,
} from '@capacitor-community/advertising-id';

@Injectable({
  providedIn: 'root',
})
export class AdvertisingIdService {
  public readonly authorized: AdvertisingStatus = 'Authorized';
  private readonly addStatusSubject = new Subject<AdvertisingStatus>();

  private readonly notDetermined = 'Not Determined';

  public getAddStatus(): Observable<AdvertisingStatus> {
    return this.addStatusSubject.asObservable();
  }

  public initializeStatusObservable(): void {
    interval(1000) // check every second
      .pipe(
        switchMap(() => from(AdvertisingId.getAdvertisingStatus())),
        takeWhile((result) => result.status === this.notDetermined, true)
      )
      .subscribe((result) => {
        this.addStatusSubject.next(result.status);
      });
  }
}
