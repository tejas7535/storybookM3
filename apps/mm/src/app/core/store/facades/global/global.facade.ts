import { inject, Injectable } from '@angular/core';

import { MMSeparator } from '@mm/core/services';
import { Store } from '@ngrx/store';

import { getBannerOpen } from '@schaeffler/banner';

import { GlobalActions } from '../../actions/global/global.actions';
import * as GlobalSelectors from '../../selectors/global/global.selector';

@Injectable({
  providedIn: 'root',
})
export class GlobalFacade {
  private readonly store = inject(Store);

  public readonly isInitialized$ = this.store.select(
    GlobalSelectors.getIsInitialized
  );
  public readonly isInternalUser$ = this.store.select(
    GlobalSelectors.getIsInternalUser
  );
  public readonly isBannerOpened$ = this.store.select(getBannerOpen);

  public initGlobal(bearingId?: string, separator?: MMSeparator): void {
    this.store.dispatch(
      GlobalActions.initGlobal({
        bearingId,
        separator,
      })
    );
  }
}
