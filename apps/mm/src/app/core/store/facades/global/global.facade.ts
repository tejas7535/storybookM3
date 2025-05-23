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
  public readonly isStandalone$ = this.store.select(
    GlobalSelectors.getIsStandalone
  );
  public readonly appDelivery$ = this.store.select(
    GlobalSelectors.getAppDelivery
  );
  public readonly appDeliveryEmbedded$ = this.store.select(
    GlobalSelectors.getAppDeliveryEmbedded
  );
  public readonly isInternalUser$ = this.store.select(
    GlobalSelectors.getIsInternalUser
  );
  public readonly isBannerOpened$ = this.store.select(getBannerOpen);

  public initGlobal(
    isStandalone?: boolean,
    bearingId?: string,
    separator?: MMSeparator,
    language?: string
  ): void {
    this.store.dispatch(
      GlobalActions.initGlobal({
        isStandalone,
        bearingId,
        separator,
        language,
      })
    );
  }
}
