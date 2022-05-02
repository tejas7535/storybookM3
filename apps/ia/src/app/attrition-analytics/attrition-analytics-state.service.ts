import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { LOCAL_STORAGE_APP_KEY } from '../shared/constants';
import { FeatureParams } from './models/feature-params.model';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsStateService {
  readonly DEFAULT_FEATURES: FeatureParams[] = [
    { feature: 'Age', region: 'Germany', year: 2021, month: 12 },
    { feature: 'Education', region: 'Germany', year: 2021, month: 12 },
    { feature: 'Position', region: 'Germany', year: 2021, month: 12 },
  ];

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  readonly selectedFeaturesKey = `${LOCAL_STORAGE_APP_KEY}-selected-features`;

  setSelectedFeatures(features: FeatureParams[]): void {
    this.localStorage.setItem(
      this.selectedFeaturesKey,
      JSON.stringify(features)
    );
  }

  getSelectedFeatures(): FeatureParams[] {
    return (
      JSON.parse(this.localStorage.getItem(this.selectedFeaturesKey)) ??
      this.DEFAULT_FEATURES
    );
  }
}
