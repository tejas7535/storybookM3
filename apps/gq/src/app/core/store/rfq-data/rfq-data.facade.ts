import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { rfqDataFeature } from './rfq-data.reducer';

@Injectable({
  providedIn: 'root',
})
export class RfqDataFacade {
  rfqDataUpdateAvl$: Observable<boolean> = this.store.select(
    rfqDataFeature.getRfqDataUpdateAvl
  );

  constructor(private readonly store: Store) {}
}
