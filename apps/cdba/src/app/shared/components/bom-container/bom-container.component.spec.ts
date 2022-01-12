import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import { GridApi } from '@ag-grid-enterprise/all-modules';
import * as compareActions from '@cdba/compare/store/actions/compare.actions';
import * as detailActions from '@cdba/core/store/actions/detail/detail.actions';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import {
  BOM_MOCK,
  COMPARE_STATE_MOCK,
  DETAIL_STATE_MOCK,
} from '@cdba/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomItem, Calculation } from '../../models';
import { BomChartModule } from '../bom-chart/bom-chart.module';
import { BomLegendModule } from '../bom-legend/bom-legend.module';
import { BomOverlayModule } from '../bom-overlay/bom-overlay.module';
import { BomTableModule } from '../bom-table/bom-table.module';
import { CalculationsTableModule } from '../calculations-table/calculations-table.module';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { BomContainerComponent } from './bom-container.component';

describe('BomContainerComponent', () => {
  let component: BomContainerComponent;
  let spectator: Spectator<BomContainerComponent>;
  let store: MockStore;

  const index = 0;

  const createComponent = createComponentFactory({
    component: BomContainerComponent,
    imports: [
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      MatIconModule,
      MatMenuModule,
      MatButtonModule,
      MatSidenavModule,
      BomOverlayModule,
      MockModule(BomTableModule),
      MockModule(CalculationsTableModule),
      MockModule(BomChartModule),
      MockModule(BomLegendModule),
      MockModule(LoadingSpinnerModule),
      MaterialNumberModule,
    ],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
          compare: COMPARE_STATE_MOCK,
        },
      }),
      mockProvider(ApplicationInsightsService),
      mockProvider(TranslocoLocaleService),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ props: { index } });
    component = spectator.component;

    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    beforeEach(() => {
      component['initializeWithCompareSelectors'] = jest.fn();
      component['initializeWithDetailSelectors'] = jest.fn();
    });

    test('should initialize with detail selectors if index is undefined', () => {
      spectator.setInput({ index: undefined });

      component.ngOnInit();

      expect(component['initializeWithDetailSelectors']).toHaveBeenCalled();
      expect(
        component['initializeWithCompareSelectors']
      ).not.toHaveBeenCalled();
    });

    test('should initialize with compare selectors if index is defined', () => {
      component.ngOnInit();

      expect(component['initializeWithDetailSelectors']).not.toHaveBeenCalled();
      expect(component['initializeWithCompareSelectors']).toHaveBeenCalled();
    });
  });

  describe('initializeWithDetailSelectors', () => {
    test(
      'should use detail selectors to init observables',
      marbles((m) => {
        const expectedChildrenOfSelectedBomItem = [
          {
            activityType: 'activity',
            bomCostingDate: '20200707',
            bomCostingNumber: '1234',
            bomCostingType: 'exp',
            bomCostingVersion: 'new',
            bomEnteredManually: 'yes',
            bomReferenceObject: 'ref',
            bomValuationVariant: 'var',
            cavity: 2,
            costCenter: 'cost',
            currency: 'EUR',
            currencyForeign: 'EUR',
            cycleTime: 4,
            level: 2,
            lotsize: 2.3,
            materialDesignation: 'FE-2315',
            materialNumber: '1234',
            parentLotsize: 23,
            parentMaterialNumber: '6789',
            parentPlant: '0007',
            plant: '0003',
            predecessorsInTree: ['FE-2313', 'FE-2315'],
            procurementType: 'type',
            quantityPerParent: 4,
            rowId: 2,
            setupTime: 2,
            toolingFactor: 2,
            totalPricePerPc: 13,
            unitOfMeasure: 'pc',
          },
        ];

        component['initializeWithDetailSelectors']();

        m.expect(component.materialDesignation$).toBeObservable(
          m.cold('a', { a: 'F-446509.SLH' })
        );

        m.expect(component.calculations$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.calculations.items })
        );
        m.expect(component.selectedCalculation$).toBeObservable(
          m.cold('a', {
            a: DETAIL_STATE_MOCK.calculations.selectedCalculation.calculation,
          })
        );
        m.expect(component.selectedCalculationNodeId$).toBeObservable(
          m.cold('a', {
            a: ['3'],
          })
        );
        m.expect(component.calculationsLoading$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.calculations.loading })
        );
        m.expect(component.calculationsErrorMessage$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.calculations.error })
        );

        m.expect(component.bomItems$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.bom.items })
        );
        m.expect(component.bomLoading$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.bom.loading })
        );
        m.expect(component.bomErrorMessage$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.bom.error })
        );
        m.expect(component.childrenOfSelectedBomItem$).toBeObservable(
          m.cold('a', { a: expectedChildrenOfSelectedBomItem })
        );
      })
    );
  });

  describe('initializeWithCompareSelectors', () => {
    test(
      'should use compare selectors to init observables',
      marbles((m) => {
        const expectedChildrenOfSelectedBomItem: BomItem[] = [];

        component['initializeWithCompareSelectors']();

        m.expect(component.materialDesignation$).toBeObservable(
          m.cold('a', { a: 'F-446509.SLH' })
        );
        m.expect(component.calculations$).toBeObservable(
          m.cold('a', { a: COMPARE_STATE_MOCK[0].calculations.items })
        );
        m.expect(component.selectedCalculationNodeId$).toBeObservable(
          m.cold('a', {
            a: [COMPARE_STATE_MOCK[0].calculations.selectedNodeId],
          })
        );
        m.expect(component.selectedCalculation$).toBeObservable(
          m.cold('a', { a: COMPARE_STATE_MOCK[0].calculations.selected })
        );
        m.expect(component.calculationsLoading$).toBeObservable(
          m.cold('a', { a: COMPARE_STATE_MOCK[0].calculations.loading })
        );
        m.expect(component.calculationsErrorMessage$).toBeObservable(
          m.cold('a', { a: undefined })
        );

        m.expect(component.bomItems$).toBeObservable(
          m.cold('a', { a: COMPARE_STATE_MOCK[0].billOfMaterial.items })
        );
        m.expect(component.bomLoading$).toBeObservable(
          m.cold('a', { a: COMPARE_STATE_MOCK[0].billOfMaterial.loading })
        );
        m.expect(component.bomErrorMessage$).toBeObservable(
          m.cold('a', { a: undefined })
        );
        m.expect(component.childrenOfSelectedBomItem$).toBeObservable(
          m.cold('a', { a: expectedChildrenOfSelectedBomItem })
        );
      })
    );
  });

  describe('selectCalculation', () => {
    const nodeId = '7';
    const calculation = {} as unknown as Calculation;

    beforeEach(() => {
      store.dispatch = jest.fn();
    });

    test('should dispatch fromDetail.selectCalculation Action when index is undefined', () => {
      spectator.setInput({ index: undefined });

      component.selectCalculation([{ nodeId, calculation }]);

      expect(store.dispatch).toHaveBeenCalledWith(
        detailActions.selectCalculation({ nodeId, calculation })
      );
    });

    test('should dispatch fromCompare.selectCalculation Action when index is set', () => {
      component.selectCalculation([{ nodeId, calculation }]);

      expect(store.dispatch).toHaveBeenCalledWith(
        compareActions.selectCalculation({ nodeId, calculation, index })
      );
    });
  });

  describe('selectBomItem', () => {
    const item = BOM_MOCK[0];

    beforeEach(() => {
      store.dispatch = jest.fn();
    });

    test('should dispatch fromDetail.selectBomItem Action when index is undefined', () => {
      spectator.setInput({ index: undefined });

      component.selectBomItem(item);

      expect(store.dispatch).toHaveBeenCalledWith(
        detailActions.selectBomItem({ item })
      );
    });

    test('should dispatch fromCompare.selectBomItem Action when index is undefined', () => {
      component.selectBomItem(item);

      expect(store.dispatch).toHaveBeenCalledWith(
        compareActions.selectBomItem({ item, index })
      );
    });
  });

  describe('onGridReady', () => {
    test('should initialize passed gridApi', () => {
      const gridApi = {
        exportDataAsExcel: jest.fn(),
        getColumnDefs: jest.fn(() => [{}, {}]),
      } as unknown as GridApi;

      component.onGridReady(gridApi);

      expect(component['gridApi']).toEqual(gridApi);
    });
  });

  describe('exportBomAsExcelFile', () => {
    beforeEach(() => {
      component['gridApi'] = {
        exportDataAsExcel: jest.fn(),
        getColumnDefs: jest.fn(() => [{}, {}]),
      } as unknown as GridApi;

      component.materialDesignation = 'F-577462.07.SLHS';
      component.selectedCalculation = {
        materialNumber: '087027550000012',
        costType: 'GPCB',
        calculationDate: '2021-06-01T00:00:00',
      } as unknown as Calculation;
    });

    test('should delegate excel export to Grid API and include correct metadata', () => {
      component.exportBomAsExcelFile();

      expect(component['gridApi'].exportDataAsExcel).toHaveBeenCalledWith({
        author: 'CDBA (Cost Database Analytics)',
        fileName: 'CDBA-Bill-Of-Materials-F-577462.07.SLHS.xlsx',
        sheetName: 'F-577462.07.SLHS',
        allColumns: true,
        prependContent: expect.anything(),
      });
    });

    test('should log export event to ai', () => {
      component.exportBomAsExcelFile();

      expect(component['applicationInsights'].logEvent).toHaveBeenCalledWith(
        'BoM Excel Export',
        {
          materialDesignation: 'F-577462.07.SLHS',
        }
      );
    });
  });
});
