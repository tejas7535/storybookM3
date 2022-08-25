import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { BetaFeature } from '@cdba/shared/constants/beta-feature';

@Injectable({
  providedIn: 'root',
})
export class BetaFeatureService {
  public storageKeyPrefix = 'beta_feature';

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  public getBetaFeature(key: `${BetaFeature}`): boolean {
    return JSON.parse(
      this.localStorage.getItem(`${this.storageKeyPrefix}_${key}`)
    );
  }

  public setBetaFeature(
    key: `${BetaFeature}`,
    betaFeatureState: boolean
  ): void {
    this.localStorage.setItem(
      `${this.storageKeyPrefix}_${key}`,
      JSON.stringify(betaFeatureState)
    );
  }
}
