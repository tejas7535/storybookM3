import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
  MATERIAL_SALES_ORG_STATE_MOCK,
  PLANT_MATERIAL_DETAILS_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { MATERIAL_COST_DETAILS_STATE_MOCK } from '../../../../testing/mocks/state/material-cost-details-state.mock';
import { LabelTextModule } from '../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { TransformationService } from '../../../shared/services/transformation/transformation.service';
import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details/material-comparable-cost-details.component';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';
import { ProductionCostDetailsComponent } from './production-cost-details/production-cost-details.component';
import { RelocationCostDetailsComponent } from './relocation-cost-details/relocation-cost-details.component';
import { StockAvailabilityDetailsComponent } from './stock-availability-details/stock-availability-details.component';
import { SupplyChainDetailsComponent } from './supply-chain-details/supply-chain-details.component';

describe('PricingDetailsComponent', () => {
  let component: PricingDetailsComponent;
  let spectator: Spectator<PricingDetailsComponent>;

  const createComponent = createComponentFactory({
    component: PricingDetailsComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      MatCardModule,
      MaterialDetailsModule,
      MatExpansionModule,
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      PushModule,
      LoadingSpinnerModule,
      LabelTextModule,
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
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: TransformationService,
        useValue: { transformMarginDetails: jest.fn() },
      },
    ],
    declarations: [
      SupplyChainDetailsComponent,
      ProductionCostDetailsComponent,
      RelocationCostDetailsComponent,
      MaterialComparableCostDetailsComponent,
      StockAvailabilityDetailsComponent,
    ],
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
