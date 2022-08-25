import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as compareActions from '@cdba/compare/store/actions';
import * as detailActions from '@cdba/core/store/actions/detail';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { ResizeModule } from '@cdba/shared/directives/resize/index';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import {
  BOM_ODATA_MOCK,
  COMPARE_STATE_MOCK,
  COST_COMPONENT_SPLIT_ITEMS_MOCK,
  DETAIL_STATE_MOCK,
} from '@cdba/testing/mocks';

import { Calculation, CostComponentSplit } from '../../models';
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
      MockModule(LetModule),
      MockModule(PushModule),
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      MatIconModule,
      MatMenuModule,
      MatButtonModule,
      MatSidenavModule,
      MockModule(BomOverlayModule),
      MockModule(BomTableModule),
      MockModule(CalculationsTableModule),
      MockModule(BomChartModule),
      MockModule(BomLegendModule),
      MockModule(LoadingSpinnerModule),
      MockModule(ResizeModule),
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
        const expectedChildrenOfSelectedBomItem = [BOM_ODATA_MOCK[1]];
        const expectedCostComponentSplitSummary: CostComponentSplit[] = [
          {
            costComponent: undefined,
            description: undefined,
            splitType: 'TOTAL',
            totalValue: 1.4686,
            fixedValue: 0.5616,
            variableValue: 0.907,
            currency: 'USD',
          },
        ];
        const expectedCostComponentSplitItems: CostComponentSplit[] =
          COST_COMPONENT_SPLIT_ITEMS_MOCK;

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
          m.cold('a', { a: DETAIL_STATE_MOCK.calculations.errorMessage })
        );

        m.expect(component.bomItems$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.bom.items })
        );
        m.expect(component.bomLoading$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.bom.loading })
        );
        m.expect(component.bomErrorMessage$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.bom.errorMessage })
        );
        m.expect(component.childrenOfSelectedBomItem$).toBeObservable(
          m.cold('a', { a: expectedChildrenOfSelectedBomItem })
        );

        m.expect(component.costComponentSplitItems$).toBeObservable(
          m.cold('a', { a: expectedCostComponentSplitItems })
        );
        m.expect(component.costComponentSplitSummary$).toBeObservable(
          m.cold('a', { a: expectedCostComponentSplitSummary })
        );
        m.expect(component.costComponentSplitLoading$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.costComponentSplit.loading })
        );
        m.expect(component.costComponentSplitErrorMessage$).toBeObservable(
          m.cold('a', { a: DETAIL_STATE_MOCK.costComponentSplit.errorMessage })
        );

        m.expect(component.rawMaterialAnalysis$).toBeObservable(
          m.cold('a', { a: [] })
        );
        m.expect(component.rawMaterialAnalysisSummary$).toBeObservable(
          m.cold('a', { a: undefined })
        );
      })
    );
  });

  describe('initializeWithCompareSelectors', () => {
    test(
      'should use compare selectors to init observables',
      marbles((m) => {
        component['initializeWithCompareSelectors']();

        const expectedCostComponentSplitSummary: CostComponentSplit[] = [
          {
            costComponent: undefined,
            description: undefined,
            splitType: 'TOTAL',
            totalValue: 1.4686,
            fixedValue: 0.5616,
            variableValue: 0.907,
            currency: 'USD',
          },
        ];
        const expectedCostComponentSplitItems: CostComponentSplit[] =
          COST_COMPONENT_SPLIT_ITEMS_MOCK;

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
          m.cold('a', { a: [] })
        );

        m.expect(component.costComponentSplitItems$).toBeObservable(
          m.cold('a', { a: expectedCostComponentSplitItems })
        );
        m.expect(component.costComponentSplitSummary$).toBeObservable(
          m.cold('a', { a: expectedCostComponentSplitSummary })
        );
        m.expect(component.costComponentSplitLoading$).toBeObservable(
          m.cold('a', { a: COMPARE_STATE_MOCK[0].costComponentSplit.loading })
        );
        m.expect(component.costComponentSplitErrorMessage$).toBeObservable(
          m.cold('a', {
            a: COMPARE_STATE_MOCK[0].costComponentSplit.errorMessage,
          })
        );

        m.expect(component.rawMaterialAnalysis$).toBeObservable(
          m.cold('a', { a: [] })
        );
        m.expect(component.rawMaterialAnalysisSummary$).toBeObservable(
          m.cold('a', { a: undefined })
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
    const item = BOM_ODATA_MOCK[0];

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

  describe('collapseAll', () => {
    it('should call grid api to collapse all rows', () => {
      const gridApi = {
        collapseAll: jest.fn(),
      } as unknown as GridApi;
      component.onGridReady(gridApi);

      component.collapseAll();

      expect(component['gridApi'].collapseAll).toHaveBeenCalled();
    });
  });

  describe('expandAll', () => {
    it('should call grid api to expand all rows', () => {
      const gridApi = {
        expandAll: jest.fn(),
      } as unknown as GridApi;
      component.onGridReady(gridApi);

      component.expandAll();

      expect(component['gridApi'].expandAll).toHaveBeenCalled();
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
