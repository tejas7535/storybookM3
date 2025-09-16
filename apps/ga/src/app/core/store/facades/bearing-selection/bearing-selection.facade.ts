import { inject, Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { getSelectedBearing } from '../../selectors';

@Injectable({
  providedIn: 'root',
})
export class BearingSelectionFacade {
  private readonly store = inject(Store);

  public readonly selectedBearing = this.store.selectSignal(getSelectedBearing);
}
