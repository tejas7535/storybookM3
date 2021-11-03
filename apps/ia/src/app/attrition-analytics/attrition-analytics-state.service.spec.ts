import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';

import { AttritionAnalyticsStateService } from './attrition-analytics-state.service';

class LocalStorageMock {
  state: { [key: string]: string } = {};

  setItem(key: string, value: string) {
    this.state[key] = value;
  }

  getItem(key: string): string | null {
    // eslint-disable-next-line unicorn/no-null
    return this.state[key] ?? null;
  }
}

describe('AttritionAnalyticsStateService', () => {
  let spectator: SpectatorService<AttritionAnalyticsStateService>;
  let service: AttritionAnalyticsStateService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: AttritionAnalyticsStateService,
    providers: [{ provide: LOCAL_STORAGE, useClass: LocalStorageMock }],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setSelecedFeatures', () => {
    test('should set selected features', () => {
      const selectedFeatures = [
        { feature: 'Age', region: 'China', year: 2019, month: 5 },
        { feature: 'Position', region: 'Europe', year: 2020, month: 6 },
        { feature: 'Distance', region: 'Asia', year: 2021, month: 7 },
      ];
      const selectedFeaturesJSON = JSON.stringify(selectedFeatures);
      localStorage.setItem = jest.fn();

      service.setSelectedFeatures(selectedFeatures);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'ia-selected-features',
        selectedFeaturesJSON
      );
    });
  });

  describe('getSelecedFeatures', () => {
    test('should get selected features from local storage', () => {
      const expectedFeatures = ['Age', 'Position', 'Distance'];
      const expectedFeaturesJSON = JSON.stringify(expectedFeatures);
      localStorage.state = {
        'ia-selected-features': expectedFeaturesJSON,
      };

      const result = service.getSelectedFeatures();

      expect(result).toEqual(expectedFeatures);
    });

    test('should get default features when no data in local storage', () => {
      const result = service.getSelectedFeatures();

      expect(result).toEqual(service.DEFAULT_FEATURES);
    });

    test('should get empty features when data in local storage empty', () => {
      localStorage.state = {
        'ia-selected-features': '[]',
      };

      const result = service.getSelectedFeatures();

      expect(result.length).toEqual(0);
    });
  });
});
