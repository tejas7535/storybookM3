import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeatureToggleConfigService } from '../shared/services/feature-toggle/feature-toggle-config.service';
import { FeatureToggleViewComponent } from './feature-toggle-view.component';
jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('FeatureToggleView', () => {
  let component: FeatureToggleViewComponent;
  let spectator: Spectator<FeatureToggleViewComponent>;
  let featureConfigService: FeatureToggleConfigService;

  const createComponent = createComponentFactory({
    component: FeatureToggleViewComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      CommonModule,
      RouterTestingModule,
      SubheaderModule,
      MatCardModule,
      MatButtonModule,
      HttpClientTestingModule,
      MockModule(MatSlideToggleModule),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    featureConfigService = spectator.inject(FeatureToggleConfigService);
    featureConfigService.initializeLocalStorage = jest.fn();
    featureConfigService.isEnabled = jest.fn();
    featureConfigService.saveConfigToLocalStorage = jest.fn();

    featureConfigService['_isProd'] = false;
    featureConfigService['_config'] = 'anyConfig';
  });
  test('should create', () => {
    expect(component).toBeTruthy();
    expect(component.configs).toEqual([{ key: '*', value: true }]);
  });

  test('should call service methods', () => {
    expect(featureConfigService.Config).toBe('anyConfig');
    expect(featureConfigService.isProduction).toBe(false);
  });

  describe('featureToggleChanged', () => {
    test('should update the configuration', () => {
      component.configs = [{ key: 'first', value: false }];
      component.featureToggleChanged({
        checked: true,
        source: { name: 'first' },
      } as MatSlideToggleChange);

      expect(component.configs).toEqual([{ key: 'first', value: true }]);
    });
    test('should not update, item not found in config the configuration', () => {
      component.configs = [{ key: 'first', value: false }];
      component.featureToggleChanged({
        checked: true,
        source: { name: 'name' },
      } as MatSlideToggleChange);

      expect(component.configs).toEqual([{ key: 'first', value: false }]);
    });
  });

  describe('saveConfig', () => {
    test('should call service', () => {
      component.saveConfig();
      expect(featureConfigService.saveConfigToLocalStorage).toHaveBeenCalled();
      expect(
        featureConfigService.saveConfigToLocalStorage
      ).toHaveBeenCalledWith({ '*': true });
    });
  });
});
