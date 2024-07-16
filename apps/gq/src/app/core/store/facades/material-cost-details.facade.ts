import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MaterialCostDetails } from '@gq/shared/models/quotation-detail/material-cost-details';
import { Store } from '@ngrx/store';

import {
  getMaterialCostDetails,
  getMaterialCostDetailsLoading,
  getMaterialCostUpdateAvl,
} from '../selectors/material-cost-details/material-cost-details.selectors';

@Injectable({
  providedIn: 'root',
})
export class MaterialCostDetailsFacade {
  readonly store: Store = inject(Store);

  materialCostDetails$: Observable<MaterialCostDetails> = this.store.select(
    getMaterialCostDetails
  );

  materialCostDetailsLoading$: Observable<boolean> = this.store.select(
    getMaterialCostDetailsLoading
  );

  materialCostUpdateAvl$: Observable<boolean> = this.store.select(
    getMaterialCostUpdateAvl
  );
}
