import { Injectable } from '@angular/core';

import { BetaFeature } from '@cdba/shared/constants/beta-feature';

import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BetaFeatureService {
  storageKeyPrefix = 'beta_feature';

  constructor(private readonly localStorageService: LocalStorageService) {}

  getBetaFeature(key: `${BetaFeature}`): boolean {
    return this.localStorageService.getItem<boolean>(
      `${this.storageKeyPrefix}_${key}`,
      false
    );
  }

  setBetaFeature(key: `${BetaFeature}`, betaFeatureState: boolean): void {
    this.localStorageService.setItem(
      `${this.storageKeyPrefix}_${key}`,
      betaFeatureState,
      false
    );
  }
}
