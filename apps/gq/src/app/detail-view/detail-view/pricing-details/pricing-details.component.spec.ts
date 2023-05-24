import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import {} from 'apps/gq/src/testing/mocks/state/material-cost-details-state.mock';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
  MATERIAL_COST_DETAILS_STATE_MOCK,
  MATERIAL_SALES_ORG_STATE_MOCK,
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
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
      PushModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
          materialSalesOrg: MATERIAL_SALES_ORG_STATE_MOCK,
          materialComparableCosts: MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
          plantMaterialDetails: PLANT_MATERIAL_DETAILS_STATE_MOCK,
          materialCostDetails: MATERIAL_COST_DETAILS_STATE_MOCK,
        },
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
  describe('ngOnInit', () => {
    test(
      'should initalize observables',
      marbles((m) => {
        component.ngOnInit();

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: QUOTATION_MOCK.currency,
        });
        m.expect(component.materialSalesOrgLoading$).toBeObservable('a', {
          a: MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrgLoading,
        });
        m.expect(component.materialComparableCostsLoading$).toBeObservable(
          'a',
          {
            a: MATERIAL_COMPARABLE_COSTS_STATE_MOCK.materialComparableCostsLoading,
          }
        );
        m.expect(component.plantMaterialDetailsLoading$).toBeObservable('a', {
          a: PLANT_MATERIAL_DETAILS_STATE_MOCK.plantMaterialDetailsLoading,
        });
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
