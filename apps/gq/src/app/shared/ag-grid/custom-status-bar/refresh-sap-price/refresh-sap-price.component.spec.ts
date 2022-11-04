import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { refreshSapPricing } from '../../../../core/store';
import { EVENT_NAMES } from '../../../models';
import { RefreshSapPriceComponent } from './refresh-sap-price.component';

describe('RefreshSapPriceComponent', () => {
  let component: RefreshSapPriceComponent;
  let spectator: Spectator<RefreshSapPriceComponent>;
  let store: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: RefreshSapPriceComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogModule,
      MatTooltipModule,
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);

    store.dispatch = jest.fn();
    component['dialog'].open = jest.fn(
      () =>
        ({
          afterClosed: () => of(true),
        } as any)
    );
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set simulationModeEnabled', () => {
      component.agInit();

      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('refreshSapPricing', () => {
    test('should upload to SAP', () => {
      component.refreshSapPricing();

      expect(component['dialog'].open).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledTimes(3);
      expect(store.dispatch).toHaveBeenLastCalledWith(refreshSapPricing());
    });
  });

  describe('tracking', () => {
    test('should track SAP_DATA_REFRESHED on refreshSapPricing', () => {
      component.refreshSapPricing();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.SAP_DATA_REFRESHED
      );
    });
  });
});
