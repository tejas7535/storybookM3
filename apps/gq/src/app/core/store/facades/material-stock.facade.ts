import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { MaterialStock } from '../reducers/models';
import {
  getMaterialStock,
  getMaterialStockLoading,
} from '../selectors/material-stock/material-stock.selectors';

@Injectable({
  providedIn: 'root',
})
export class MaterialStockFacade {
  private readonly store: Store = inject(Store);

  materialStock$: Observable<MaterialStock> =
    this.store.select(getMaterialStock);

  materialStockLoading$: Observable<boolean> = this.store.select(
    getMaterialStockLoading
  );
}
