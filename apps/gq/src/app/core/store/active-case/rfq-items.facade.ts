import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { QuotationDetail } from '@gq/shared/models';
import { Store } from '@ngrx/store';

import { activeCaseFeature } from './active-case.reducer';

@Injectable({
  providedIn: 'root',
})
export class RfqItemsFacade {
  private readonly store: Store = inject(Store);

  // #############################################################################################
  // ##################   Observables ############################################################
  // #############################################################################################
  hasRfqItems$: Observable<boolean> = this.store.select(
    activeCaseFeature.hasRfqItems
  );
  rfqItems$: Observable<QuotationDetail[]> = this.store.select(
    activeCaseFeature.getRfqItems
  );
}
