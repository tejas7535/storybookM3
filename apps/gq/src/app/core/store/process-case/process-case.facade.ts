import { inject, Injectable } from '@angular/core';

import { MaterialTableItem } from '@gq/shared/models/table/material-table-item-model';
import { Store } from '@ngrx/store';

import { ProcessCaseActions } from './process-case.action';

@Injectable({
  providedIn: 'root',
})
export class ProcessCaseFacade {
  private readonly store: Store = inject(Store);
  // #################################################################
  // ############################# methods ###########################
  // #################################################################
  updateItemFromMaterialTable(
    recentData: MaterialTableItem,
    revalidate: boolean = false
  ): void {
    this.store.dispatch(
      ProcessCaseActions.updateItemFromMaterialTable({
        item: recentData,
        revalidate,
      })
    );
  }

  validateMaterialTableItems(): void {
    this.store.dispatch(ProcessCaseActions.validateMaterialTableItems());
  }
}
