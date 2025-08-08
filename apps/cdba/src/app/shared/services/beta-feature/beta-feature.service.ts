import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RoleFacade } from '@cdba/core/auth/role-facade/role.facade';
import { BetaFeature } from '@cdba/shared/constants/beta-feature';

import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BetaFeatureService {
  private readonly storageKeyPrefix = 'beta_feature';

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly roleFacade: RoleFacade
  ) {}

  getBetaFeature(key: `${BetaFeature}`): boolean | undefined {
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

  canAccessBetaFeature$(
    betaFeature: BetaFeature
  ): Observable<boolean | undefined> {
    const isBetaFeatureEnabled = this.getBetaFeature(betaFeature);

    return this.roleFacade.hasBetaUserRole$.pipe(
      map((hasBetaUserRole) => hasBetaUserRole && isBetaFeatureEnabled)
    );
  }
}
