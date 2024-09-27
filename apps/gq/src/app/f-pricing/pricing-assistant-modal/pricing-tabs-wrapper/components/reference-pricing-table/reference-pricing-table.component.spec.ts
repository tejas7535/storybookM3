import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ComparableMaterialsRowData } from '@gq/core/store/transactions/models/f-pricing-comparable-materials.interface';
import { LocalizationService } from '@gq/shared/ag-grid/services';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { when } from 'jest-when';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { COMPARABLE_MATERIALS_ROW_DATA_MOCK } from '../../../../../../testing/mocks/models/fpricing/f-pricing-comparable-materials.mock';
import { ColumnDefinitionService } from './config/column-definition.service';
import { ReferencePricingTableComponent } from './reference-pricing-table.component';

describe('ReferencePricingTableComponent', () => {
  let component: ReferencePricingTableComponent;
  let spectator: Spectator<ReferencePricingTableComponent>;

  const createComponent = createComponentFactory({
    component: ReferencePricingTableComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      MockProvider(LocalizationService),
      MockProvider(ColumnDefinitionService, {
        INITIAL_NUMBER_OF_DISPLAYED_ROWS: 2,
        ROWS_TO_ADD_ON_SHOW_MORE: 2,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.gridOptions = {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    test('should call init', () => {
      component['agGridStateService'].init = jest.fn();
      component['setInitialRowData'] = jest.fn();
      component.currency = 'EUR';

      component.ngOnInit();

      expect(component['agGridStateService'].init).toHaveBeenCalledTimes(1);
      expect(component.gridOptions).toEqual({
        ...component['columnDefService'].GRID_OPTIONS,
        context: {
          componentParent: component,
          quotation: {
            currency: component.currency,
          },
        },
      });
      expect(component['setInitialRowData']).toHaveBeenCalledTimes(1);
    });
  });

  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        columnApi: {
          applyColumnState: jest.fn(),
        },
        api: {
          sizeColumnsToFit: jest.fn(),
          setRowData: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnStateForCurrentView = jest
        .fn()
        .mockReturnValueOnce('test');
      component.onGridReady(event);

      expect(event.columnApi.applyColumnState).toHaveBeenCalledTimes(1);
      expect(event.api.sizeColumnsToFit).toHaveBeenCalledTimes(1);
    });
  });

  describe('onColumnChange', () => {
    test('should set column state', () => {
      const event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnStateForCurrentView = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnStateForCurrentView
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('comparableMaterialClicked', () => {
    test('should emit value', () => {
      component.comparedMaterialClicked.emit = jest.fn();
      component.comparableMaterialClicked('test');

      expect(component.comparedMaterialClicked.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('showMoreRowsClicked', () => {
    test('should call addRowsOfMaterial', () => {
      component['addRowsOfMaterial'] = jest.fn();
      component.showMoreRowsClicked('test');

      expect(component['addRowsOfMaterial']).toHaveBeenCalledTimes(1);
    });
  });

  describe('setInitialRowData', () => {
    test('should set the initial row data with show more rows', () => {
      const showMoreFirst = {
        identifier: 100,
        isShowMoreRow: true,
        parentMaterialDescription: '22210-E1-XL#N1',
      } as ComparableMaterialsRowData;

      const showMoreSecond = {
        identifier: 200,
        isShowMoreRow: true,
        parentMaterialDescription: '55555-E1-XL#N1',
      } as ComparableMaterialsRowData;

      const expectedResult = [
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[0],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[1],
        showMoreFirst,
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[5],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[6],
        showMoreSecond,
      ];

      const addShowMoreRowMock = (component['addShowMoreRow'] = jest.fn());
      when(addShowMoreRowMock)
        .calledWith('22210-E1-XL#N1', expect.any(Number))
        .mockImplementation(() => {
          component.visibleRowData.push(showMoreFirst);
        });
      when(addShowMoreRowMock)
        .calledWith('55555-E1-XL#N1', expect.any(Number))
        .mockImplementation(() => {
          component.visibleRowData.push(showMoreSecond);
        });
      component.inputRowData = COMPARABLE_MATERIALS_ROW_DATA_MOCK;

      component['setInitialRowData']();

      expect(component.visibleRowData).toEqual(expectedResult);
      expect(addShowMoreRowMock).toHaveBeenCalledTimes(2);
    });
    test('should set the initial row data without show more rows', () => {
      const expectedResult = [
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[0],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[1],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[5],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[6],
      ];
      component.inputRowData = expectedResult;
      component['addShowMoreRow'] = jest.fn();

      component['setInitialRowData']();

      expect(component.visibleRowData).toEqual(expectedResult);
      expect(component['addShowMoreRow']).not.toHaveBeenCalled();
    });
  });

  describe('addShowMoreRow', () => {
    test('should add show more row', () => {
      component.visibleRowData = [];
      const expectedResult = {
        identifier: 100,
        isShowMoreRow: true,
        parentMaterialDescription: '22210-E1-XL#N1',
      } as ComparableMaterialsRowData;

      component['addShowMoreRow']('22210-E1-XL#N1', expectedResult.identifier);

      expect(component.visibleRowData[0]).toEqual(expectedResult);
    });
  });

  describe('addRowsOfMaterial', () => {
    test('should add rows of material', () => {
      component.inputRowData = COMPARABLE_MATERIALS_ROW_DATA_MOCK;
      const showMoreFirst = {
        identifier: 100,
        isShowMoreRow: true,
        parentMaterialDescription: '22210-E1-XL#N1',
      } as ComparableMaterialsRowData;

      const showMoreSecond = {
        identifier: 200,
        isShowMoreRow: true,
        parentMaterialDescription: '55555-E1-XL#N1',
      } as ComparableMaterialsRowData;

      const addShowMoreRowMock = (component['addShowMoreRow'] = jest.fn());
      when(addShowMoreRowMock)
        .calledWith('22210-E1-XL#N1', expect.any(Number))
        .mockImplementation(() => {
          component.visibleRowData.push(showMoreFirst);
        });
      when(addShowMoreRowMock)
        .calledWith('55555-E1-XL#N1', expect.any(Number))
        .mockImplementation(() => {
          component.visibleRowData.push(showMoreSecond);
        });

      const expectedResult = [
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[0],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[1],
        showMoreFirst,
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[5],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[6],
        showMoreSecond,
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[2],
        COMPARABLE_MATERIALS_ROW_DATA_MOCK[3],
      ];
      const event = {
        columnApi: {
          applyColumnState: jest.fn(),
        },
        api: {
          sizeColumnsToFit: jest.fn(),
          setRowData: jest.fn(),
        },
      } as any;

      component.ngOnInit();
      // rows have already been added once in ngOnInit ;-)
      component.onGridReady(event);

      component['addRowsOfMaterial']('22210-E1-XL#N1');

      // ASSERT
      expect(component.visibleRowData).toEqual(expectedResult);
      expect(component['rowsToDisplayByMaterial'].get('22210-E1-XL#N1')).toBe(
        4
      );

      expect(component.gridOptions.api.setRowData).toHaveBeenCalledTimes(2); // 1x in OnGridReady, 1x in addRowsOfMaterial
    });
  });

  describe('setRowsOfMaterialsToDisplay', () => {
    test('should set rows of materials to display when still something to add', () => {
      component.inputRowData = COMPARABLE_MATERIALS_ROW_DATA_MOCK;
      component.ngOnInit();
      component['rowsToDisplayByMaterial'].set('22210-E1-XL#N1', 2);

      component['setRowsOfMaterialsToDisplay']('22210-E1-XL#N1', 4);

      expect(component['rowsToDisplayByMaterial'].get('22210-E1-XL#N1')).toBe(
        4
      );
    });

    test('should remove showMoreRow when nothing more to add', () => {
      component.inputRowData = COMPARABLE_MATERIALS_ROW_DATA_MOCK;
      component.ngOnInit();
      component['rowsToDisplayByMaterial'].set('22210-E1-XL#N1', 2);

      component['setRowsOfMaterialsToDisplay']('22210-E1-XL#N1', 10);

      expect(component['rowsToDisplayByMaterial'].get('22210-E1-XL#N1')).toBe(
        undefined
      );
      const findShowMoreRowForFirstMaterial = component.visibleRowData.filter(
        (item) =>
          item.isShowMoreRow &&
          item.parentMaterialDescription === '22210-E1-XL#N1'
      );
      expect(findShowMoreRowForFirstMaterial.length).toBe(0);
    });
  });

  describe('removeShowMoreRow', () => {
    test('should remove row', () => {
      component.visibleRowData = [
        {
          isShowMoreRow: true,
          parentMaterialDescription: 'anyMaterial',
        } as ComparableMaterialsRowData,
      ];

      component['removeShowMoreRow']('anyMaterial');

      expect(component.visibleRowData.length).toBe(0);
    });
  });
});
