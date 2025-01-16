import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { QuotationStatus, SAP_SYNC_STATUS } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
  MATERIAL_SALES_ORG_STATE_MOCK,
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
} from '../../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../../testing/mocks/models/quotation';
import { PricingDetailsComponent } from './pricing-details.component';

describe('PricingDetailsComponent', () => {
  let component: PricingDetailsComponent;
  let spectator: Spectator<PricingDetailsComponent>;

  const createComponent = createComponentFactory({
    component: PricingDetailsComponent,
    detectChanges: false,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      PushPipe,
    ],
    providers: [
      provideMockStore({}),
      MockProvider(ActiveCaseFacade, {
        quotationCurrency$: of(QUOTATION_MOCK.currency),
        quotationSapSyncStatus$: of(SAP_SYNC_STATUS.PARTIALLY_SYNCED),
        quotationStatus$: of(QuotationStatus.ACTIVE),
        canEditQuotation$: of(true),
        materialComparableCostsLoading$: of(
          MATERIAL_COMPARABLE_COSTS_STATE_MOCK.materialComparableCostsLoading
        ),
        materialSalesOrgLoading$: of(
          MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrgLoading
        ),
        materialSalesOrg$: of(MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrg),
        materialSalesOrgDataAvailable$: of(false),
        plantMaterialDetailsLoading$: of(
          PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetailsLoading
        ),
      }),
      MockProvider(RolesFacade, {
        userHasGPCRole$: of(true),
        userHasSQVRole$: of(true),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('observables', () => {
    test(
      'should provide observables',
      marbles((m) => {
        m.expect(component.quotationCurrency$).toBeObservable(
          m.cold('(a|)', {
            a: QUOTATION_MOCK.currency,
          })
        );
        m.expect(component.sapSyncStatus$).toBeObservable(
          m.cold('(a|)', { a: SAP_SYNC_STATUS.PARTIALLY_SYNCED })
        );
        m.expect(component.isQuotationEditable$).toBeObservable(
          m.cold('(a|)', { a: true })
        );

        m.expect(component.materialComparableCostsLoading$).toBeObservable(
          m.cold('(a|)', {
            a: MATERIAL_COMPARABLE_COSTS_STATE_MOCK.materialComparableCostsLoading,
          })
        );
        m.expect(component.materialSalesOrgLoading$).toBeObservable(
          m.cold('(a|)', {
            a: MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrgLoading,
          })
        );
        m.expect(component.materialSalesOrg$).toBeObservable(
          m.cold('(a|)', {
            a: MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrg,
          })
        );
        m.expect(component.materialSalesOrgDataAvailable$).toBeObservable(
          m.cold('(a|)', {
            a: false,
          })
        );

        m.expect(component.plantMaterialDetailsLoading$).toBeObservable(
          m.cold('(a|)', {
            a: PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetailsLoading,
          })
        );

        m.expect(component.userHasGPCRole$).toBeObservable(
          m.cold('(a|)', {
            a: true,
          })
        );

        m.expect(component.userHasSQVRole$).toBeObservable(
          m.cold('(a|)', {
            a: true,
          })
        );
      })
    );
  });

  describe('set stochastic types', () => {
    const mockQuotationDetails = {
      ...QUOTATION_MOCK.quotationDetails[0],
      productionPlant: {
        ...QUOTATION_MOCK.quotationDetails[0].productionPlant,
        plantNumber: '456',
      },
    };

    beforeEach(() => {
      spectator.setInput('quotationDetail', mockQuotationDetails);
    });

    test('should set stochastic type for production and supply plant', () => {
      spectator.setInput('plantMaterialDetails', [
        {
          material: mockQuotationDetails.material.materialNumber15,
          plantId: mockQuotationDetails.productionPlant.plantNumber,
          stochasticType: 'H',
        },
        {
          material: mockQuotationDetails.material.materialNumber15,
          plantId: mockQuotationDetails.plant.plantNumber,
          stochasticType: '1',
        },
      ]);

      expect(component.productionPlantStochasticType).toEqual('H');
      expect(component.supplyPlantStochasticType).toEqual('1');
    });
    test('should NOT set supply plant stochastic type when plant material detail is missing', () => {
      spectator.setInput('plantMaterialDetails', [
        {
          material: mockQuotationDetails.material.materialNumber15,
          plantId: mockQuotationDetails.productionPlant.plantNumber,
          stochasticType: 'H',
        },
      ]);

      expect(component.productionPlantStochasticType).toEqual('H');
      expect(component.supplyPlantStochasticType).toEqual(undefined);
    });
    test('should NOT set production plant stochastic type when plant material detail is missing', () => {
      spectator.setInput('plantMaterialDetails', [
        {
          material: mockQuotationDetails.material.materialNumber15,
          plantId: mockQuotationDetails.plant.plantNumber,
          stochasticType: '1',
        },
      ]);

      expect(component.supplyPlantStochasticType).toEqual('1');
      expect(component.productionPlantStochasticType).toEqual(undefined);
    });
  });
});
