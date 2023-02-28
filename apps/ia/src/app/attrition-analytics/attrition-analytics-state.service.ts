import { Inject, Injectable } from '@angular/core';

import { LOCAL_STORAGE } from '@ng-web-apis/common';

import { LOCAL_STORAGE_APP_KEY } from '../shared/constants';
import { FeatureParams } from './models/feature-params.model';

@Injectable({
  providedIn: 'root',
})
export class AttritionAnalyticsStateService {
  readonly DEFAULT_FEATURES: FeatureParams[] = [
    { feature: 'age', region: 'Germany', year: 2022, month: 12 },
    { feature: 'education', region: 'Germany', year: 2022, month: 12 },
    { feature: 'positionType', region: 'Germany', year: 2022, month: 12 },
  ];

  constructor(@Inject(LOCAL_STORAGE) readonly localStorage: Storage) {}

  readonly selectedFeaturesKey = `${LOCAL_STORAGE_APP_KEY}-selected-features`;

  setSelectedFeatures(features: FeatureParams[]): void {
    let nextFilters =
      JSON.parse(this.localStorage.getItem(this.selectedFeaturesKey)) || {};

    const regions = new Set(features.map((feature) => feature.region));

    for (const region of regions) {
      nextFilters = {
        ...nextFilters,
        [region]: features.filter((feature) => feature.region === region),
      };
    }

    this.localStorage.setItem(
      this.selectedFeaturesKey,
      JSON.stringify(nextFilters)
    );
  }

  getSelectedFeatures(): FeatureParams[] {
    const selectedFeaturesJSON = this.localStorage.getItem(
      this.selectedFeaturesKey
    );
    if (selectedFeaturesJSON) {
      try {
        const selectedFeatures = JSON.parse(selectedFeaturesJSON);

        let allFeatures: FeatureParams[] = [];

        const regions = Object.keys(selectedFeatures);

        for (const region of regions) {
          allFeatures = [...allFeatures, ...selectedFeatures[region]];
        }

        return allFeatures;
      } catch {
        this.localStorage.removeItem(this.selectedFeaturesKey);
      }
    }

    return this.DEFAULT_FEATURES;
  }
}
