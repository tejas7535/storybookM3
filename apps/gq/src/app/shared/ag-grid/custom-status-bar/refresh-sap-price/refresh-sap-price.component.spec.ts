import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { HideIfQuotationNotActiveOrPendingDirective } from '@gq/shared/directives/hide-if-quotation-not-active-or-pending/hide-if-quotation-not-active-or-pending.directive';
import { translate } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective, MockProvider } from 'ng-mocks';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { EVENT_NAMES } from '../../../models';
import { RefreshSapPriceComponent } from './refresh-sap-price.component';

describe('RefreshSapPriceComponent', () => {
  let component: RefreshSapPriceComponent;
  let spectator: Spectator<RefreshSapPriceComponent>;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: RefreshSapPriceComponent,
    declarations: [MockDirective(HideIfQuotationNotActiveOrPendingDirective)],
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      provideMockStore({}),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      MockProvider(ActiveCaseFacade, {
        simulationModeEnabled$: of(true),
        refreshSapPricing: jest.fn(),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    applicationInsightsService = spectator.inject(ApplicationInsightsService);

    component['dialog'].open = jest.fn(
      () =>
        ({
          afterClosed: () => of(true),
        }) as any
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
      expect(
        component['activeCaseFacade'].refreshSapPricing
      ).toHaveBeenCalledTimes(1);
      expect(translate).toHaveBeenCalledTimes(3);
      expect(
        component['activeCaseFacade'].refreshSapPricing
      ).toHaveBeenCalled();
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
