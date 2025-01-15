import { SimpleChange } from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColumnMovedEvent,
  ColumnPinnedEvent,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowNode,
} from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';

import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { BomTableModule } from '@cdba/shared/components';
import { ColumnDefinitionService } from '@cdba/shared/components/bom-table/config';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import { BOM_MOCK } from '@cdba/testing/mocks';

import { BomTableComponent } from './bom-table.component';
import { TotalCostShareComponentModule } from './bom-table-status-bar/total-cost-share/total-cost-share.component';

describe('BomTableComponent', () => {
  let component: BomTableComponent;
  let spectator: Spectator<BomTableComponent>;

  const createComponent = createComponentFactory({
    component: BomTableComponent,
    imports: [
      AgGridModule,
      MaterialNumberModule,
      MockModule(BomTableModule),
      MockModule(TotalCostShareComponentModule),
    ],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      mockProvider(ColumnDefinitionService, {
        getColDef: jest.fn(() => []),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('noRowsOverlayComponentParams', () => {
    it('should return errorMessage on getMessage', () => {
      component.errorMessage = 'test';
      const result = component.noRowsOverlayComponentParams.getMessage();

      expect(result).toEqual(component.errorMessage);
    });
  });

  describe('rowClassRules', () => {
    it('should have css classes for 15 levels', () => {
      const rowClassRules: any = component.rowClassRules;

      for (let i = 2; i <= 15; i += 1) {
        const cssClass = `row-level-${i}`;

        expect(
          rowClassRules[cssClass]({
            data: { level: i },
          })
        ).toBeTruthy();
      }
    });
  });

  describe('ngOnChanges', () => {
    it('should show loading overlay if grid loaded and isLoading active', () => {
      jest.spyOn(window, 'setTimeout');
      component['gridApi'] = {
        setGridOption: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: true,
        } as unknown as SimpleChange,
      });

      expect(setTimeout).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10);
    });

    it('should hide loading spinner and show NoRowsOverlay when loading is done', () => {
      component['gridApi'] = {
        setGridOption: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].setGridOption).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    beforeEach(() => {
      component.gridReady.emit = jest.fn();
      component['organizeColumns'] = jest.fn();
      JSON.parse = jest.fn();
    });

    it('should set api and event listener', () => {
      const mockedGridReadyEvent = {
        api: {
          addEventListener: jest.fn(),
          setGridOption: jest.fn(),
        } as unknown as GridApi,
        context: {},
      } as GridReadyEvent;
      component.isLoading = true;

      component.onGridReady(mockedGridReadyEvent);

      expect(component['gridApi']).toEqual(mockedGridReadyEvent.api);
      expect(mockedGridReadyEvent.api.addEventListener).toHaveBeenCalled();
    });

    it('should emit event to expose GridApi', () => {
      const mockedGridReadyEvent = {
        api: {
          addEventListener: jest.fn(),
          showNoRowsOverlay: jest.fn(),
        },
      } as unknown as GridReadyEvent;
      component.isLoading = false;

      component.onGridReady(mockedGridReadyEvent);

      expect(component.gridReady.emit).toHaveBeenCalledWith(
        mockedGridReadyEvent
      );
    });
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns', () => {
      const params = {
        api: {
          autoSizeAllColumns: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;

      component.onFirstDataRendered(params);

      expect(params.api.autoSizeAllColumns).toHaveBeenCalledWith(true);
    });
  });

  describe('getDataPath', () => {
    it('should return predecessors of item', () => {
      const item = BOM_MOCK[0];

      const result = component.getDataPath(item);

      expect(result).toEqual(item.predecessorsInTree);
    });
  });

  describe('onRowGroupOpened', () => {
    it('should call autosize and redraw', () => {
      component['gridApi'] = {
        redrawRows: jest.fn(),
        autoSizeColumns: jest.fn(),
      } as unknown as GridApi;

      component.onRowGroupOpened();

      expect(component['gridApi'].autoSizeColumns).toHaveBeenCalledWith([
        'ag-Grid-AutoColumn',
      ]);
      expect(component['gridApi'].redrawRows).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRowClicked', () => {
    const evt = {
      node: {
        id: '2',
        setExpanded: jest.fn(),
      },
      data: {
        id: 1,
      },
    } as unknown as RowClickedEvent;

    beforeEach(() => {
      component.rowSelected.emit = jest.fn();
      component.updateNonLevel2Children = jest.fn();
      component['gridApi'] = {
        redrawRows: jest.fn(),
      } as unknown as GridApi;
    });

    it('should emit rowSelected event', () => {
      component.onRowClicked(evt);

      expect(component.rowSelected.emit).toHaveBeenCalledWith({ id: 1 });
    });

    it('should update level 2 children and redraw', () => {
      component.onRowClicked(evt);

      expect(component.currentSelectedRow.node.id).toEqual(evt.node.id);
      expect(component.updateNonLevel2Children).toHaveBeenCalledWith(evt.node);
      expect(component['gridApi'].redrawRows).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateNonLevel2Children', () => {
    it('should recursively iterate through all children and add them to array', () => {
      const node = {
        id: '0',
        parent: {
          id: '-1',
        },
        childrenAfterGroup: [
          {
            id: '1',
            parent: {
              id: '0',
            },
            childrenAfterGroup: [],
          },
          {
            id: '2',
            parent: {
              id: '0',
            },
            childrenAfterGroup: [
              {
                id: '3',
                parent: {
                  id: '2',
                },
                childrenAfterGroup: [],
              },
            ],
          },
        ],
      } as unknown as RowNode;

      component.updateNonLevel2Children(node);

      expect(component.nonLevel2Children).toEqual(['3']);
    });
  });

  describe('getRowClass', () => {
    it('should return when unrelated row', () => {
      const params = {
        node: {
          id: '3',
          parent: {
            id: '2',
          },
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('');
    });

    it('should return top-level-row when selected node is give', () => {
      component.currentSelectedRow.node.id = '2';

      const params = {
        node: {
          id: '2',
          parent: {
            id: '1',
          },
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('top-level-row');
    });

    it('should return appropriate second-level-row if second level', () => {
      component.currentSelectedRow.node.id = '1';

      const params = {
        data: {
          totalPricePerPc: 1.5,
        },
        node: {
          id: '2',
          parent: {
            id: '1',
            data: {
              totalPricePerPc: 10,
            },
          },
          childIndex: 4,
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('row-low-cost-share');
    });
  });

  describe('customColumnsOrder', () => {
    const columnsState = [
      {
        colId: 'foo',
      },
      {
        colId: 'bar',
      },
    ];
    const columnKey = 'customColumnsOrder';
    const mockedColumnMovedEvt = {
      api: {
        getColumnState: jest.fn().mockReturnValue(columnsState),
      },
    } as unknown as ColumnMovedEvent;
    const mockedColumnPinnedEvt = {
      api: {
        getColumnState: jest.fn().mockReturnValue(columnsState),
      },
    } as unknown as ColumnPinnedEvent;

    beforeEach(() => {
      component.localStorage.clear();
      component.localStorage.setItem = jest.fn();
      JSON.stringify = jest.fn().mockReturnValue(columnsState.toString());
    });

    it('should have initially empty storage', () => {
      const customColumnsOrder = component.localStorage.getItem(
        component['customColumnsOrderKey']
      );

      expect(customColumnsOrder).toBeUndefined();
    });
    it('should save custom columns order when moving column', () => {
      const onColumnMovedSpy = jest.spyOn(component, 'onColumnMoved');

      component.onColumnMoved(mockedColumnMovedEvt);

      expect(onColumnMovedSpy).toHaveBeenCalled();
      expect(component.localStorage.setItem).toHaveBeenCalledWith(
        columnKey,
        JSON.stringify(columnsState)
      );
    });
    it('should save custom columns order when pinning column', () => {
      const onColumnPinnedSpy = jest.spyOn(component, 'onColumnPinned');

      component.onColumnPinned(mockedColumnPinnedEvt);

      expect(onColumnPinnedSpy).toHaveBeenCalled();
      expect(component.localStorage.setItem).toHaveBeenCalledWith(
        columnKey,
        JSON.stringify(columnsState)
      );
    });
  });

  describe('resetTable', () => {
    beforeEach(() => {
      component['gridApi'] = { redrawRows: jest.fn() } as unknown as GridApi;
    });
    it('should reset currentSelectedRow and nonLevel2Children', () => {
      component.currentSelectedRow = {
        node: {
          id: '1',
        },
      };

      component.nonLevel2Children = ['foo', 'bar'];

      component['resetTable']();

      expect(component.currentSelectedRow.node.id).toEqual('0');
      expect(component.nonLevel2Children).toEqual([]);
    });

    it('should readraw rows', () => {
      component['resetTable']();

      expect(component['gridApi'].redrawRows).toHaveBeenCalled();
    });
  });
});
