import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { OfferType } from '@gq/shared/models/offer-type.interface';
import { Store } from '@ngrx/store';

import { selectOfferType } from '../actions/create-case/create-case.actions';
import { OfferTypeActions } from './offer-type.actions';
import { offerTypeFeature } from './offer-type.reducer';

@Injectable({
  providedIn: 'root',
})
export class OfferTypeFacade {
  private readonly store: Store = inject(Store);

  offerTypes$: Observable<OfferType[]> = this.store.select(
    offerTypeFeature.selectOfferTypes
  );

  selectedOfferType$: Observable<OfferType> = this.store.select(
    offerTypeFeature.getSelectedOfferType
  );

  // methods
  getAllOfferTypes(): void {
    this.store.dispatch(OfferTypeActions.getAllOfferTypes());
  }

  selectOfferTypeForCaseCreation(offerType: OfferType): void {
    this.store.dispatch(selectOfferType({ offerType }));
  }
}
