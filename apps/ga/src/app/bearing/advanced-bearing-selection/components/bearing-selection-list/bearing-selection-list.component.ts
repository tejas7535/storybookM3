import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  getAdvancedBearingSelectionResultList,
  getModelCreationLoading,
  selectBearing,
} from '@ga/core/store';

@Component({
  selector: 'ga-bearing-selection-list',
  templateUrl: './bearing-selection-list.component.html',
  styleUrls: ['./bearing-selection-list.component.scss'],
})
export class BearingSelectionListComponent {
  public advancedBearingSelectionResultList$ = this.store.select(
    getAdvancedBearingSelectionResultList
  );
  public modelCreationLoading$ = this.store.select(getModelCreationLoading);

  constructor(private readonly store: Store) {}

  public selectBearing(bearing: any): void {
    this.store.dispatch(selectBearing({ bearing: bearing.id }));
  }
}
