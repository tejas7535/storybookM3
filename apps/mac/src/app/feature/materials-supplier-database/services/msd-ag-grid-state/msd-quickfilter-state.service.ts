import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { QuickFilter } from '../../models';
import { setCustomQuickfilter } from '../../store';
import { QuickFilterFacade } from '../../store/facades/quickfilter/quickfilter.facade';

@Injectable({
  providedIn: 'root',
})
// storing quickfilter state in the localstorage
export class MsdQuickfilterStateService {
  constructor(
    @Inject(LOCAL_STORAGE) readonly localStorage: Storage,
    private readonly qfFacade: QuickFilterFacade
  ) {
    // dispatch initial filters
    const filters = this.getQuickFilterState();
    this.qfFacade.dispatch(setCustomQuickfilter({ filters }));
    // subscribe to column updates and update localstorage
    this.qfFacade.quickFilter$.subscribe((qf) =>
      this.storeQuickfilterState(qf)
    );
  }

  private readonly key = 'MSD_quickfilter';

  init(): void {}

  // read state from localstorage
  private getQuickFilterState(): QuickFilter[] {
    return JSON.parse(this.localStorage.getItem(this.key) || '[]');
  }

  // store state on updates
  private storeQuickfilterState(quickfilterState: QuickFilter[]): void {
    this.localStorage.setItem(this.key, JSON.stringify(quickfilterState));
  }
}
