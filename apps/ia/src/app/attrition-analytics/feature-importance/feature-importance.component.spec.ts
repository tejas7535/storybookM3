import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { NgxEchartsModule } from 'ngx-echarts';

import { FeatureImportanceComponent } from './feature-importance.component';

import * as featureImportanceConfig from './feature-importance.config';
import { FeatureImportanceGroup } from '../models';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

jest.mock('./feature-importance.config', () => ({
  ...(jest.requireActual('./feature-importance.config') as any),
  createFeaturesImportanceConfig: jest.fn(),
}));

describe('FeatureImportanceComponent', () => {
  let component: FeatureImportanceComponent;
  let spectator: Spectator<FeatureImportanceComponent>;

  const createComponent = createComponentFactory({
    component: FeatureImportanceComponent,
    imports: [
      ReactiveComponentModule,
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initChart', () => {
    test('should create chart option', () => {
      const groups: FeatureImportanceGroup[] = [];

      component.initChart(groups);

      expect(
        featureImportanceConfig.createFeaturesImportanceConfig
      ).toHaveBeenCalledWith(groups);
    });
  });

  describe('set groups', () => {
    test('should call initChart when set', () => {
      const groups: FeatureImportanceGroup[] = [];
      component.initChart = jest.fn();
      component.groups = groups;

      expect(component.initChart).toHaveBeenCalledWith(groups);
    });

    test('should do nothing when undefined', () => {
      const groups: FeatureImportanceGroup[] = undefined;
      component.initChart = jest.fn();
      component.groups = groups;

      expect(component.initChart).not.toHaveBeenCalled();
    });
  });

  describe('loadNextFeatures', () => {
    test('should emit loadNext', () => {
      component['loadNext'].emit = jest.fn();

      component.loadNextFeatures();

      expect(component['loadNext'].emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleSortDirection', () => {
    test('should emit toggleSort', () => {
      component['toggleSort'].emit = jest.fn();

      component.toggleSortDirection();

      expect(component['toggleSort'].emit).toHaveBeenCalledTimes(1);
    });
  });
});
