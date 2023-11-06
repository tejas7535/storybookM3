import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { fPricingFeature } from './f-pricing.reducer';
import { MaterialInformationExtended } from './models/material-information-extended.interface';

@Injectable({
  providedIn: 'root',
})
export class FPricingFacade {
  materialInformation$: Observable<MaterialInformationExtended[]> =
    this.store.select(fPricingFeature.getMaterialInformationExtended);

  constructor(private readonly store: Store) {}
}
