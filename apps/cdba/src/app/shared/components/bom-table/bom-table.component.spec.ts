import { SimpleChange } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ColumnApi,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowNode,
} from '@ag-grid-enterprise/all-modules';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { ColumnUtilsService } from '@cdba/shared/components/table';
import { MaterialNumberModule } from '@cdba/shared/pipes';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { BomItem } from '../../models';
import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '../table/custom-overlay/custom-overlay.module';
import { BomTableComponent } from './bom-table.component';

/* eslint-disable max-lines */
describe('BomTableComponent', () => {
  let component: BomTableComponent;
  let spectator: Spectator<BomTableComponent>;

  const createComponent = createComponentFactory({
    component: BomTableComponent,
    imports: [
      AgGridModule.withComponents([
        CustomLoadingOverlayComponent,
        CustomNoRowsOverlayComponent,
      ]),
      CustomOverlayModule,
      MaterialNumberModule,
    ],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      mockProvider(ColumnUtilsService, {
        formatNumber: jest.fn(() => ''),
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
    it('should have css classes for 9 levels', () => {
      expect(
        component.rowClassRules['padding-left-40']({ data: { level: 2 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-80']({ data: { level: 3 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-120']({ data: { level: 4 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-160']({ data: { level: 5 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-200']({ data: { level: 6 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-240']({ data: { level: 7 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-280']({ data: { level: 8 } })
      ).toBeTruthy();
      expect(
        component.rowClassRules['padding-left-320']({ data: { level: 9 } })
      ).toBeTruthy();
    });
  });

  describe('ngOnChanges', () => {
    it('should showLoadingOverlay if grid loaded and isLoading active', () => {
      jest.spyOn(window, 'setTimeout');
      component['gridApi'] = {
        showLoadingOverlay: jest.fn(),
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
        showLoadingOverlay: jest.fn(),
        showNoRowsOverlay: jest.fn(),
      } as unknown as GridApi;

      component.ngOnChanges({
        isLoading: {
          currentValue: false,
        } as unknown as SimpleChange,
      });

      expect(component['gridApi'].showLoadingOverlay).not.toHaveBeenCalled();
      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    beforeEach(() => {
      component.gridReady.emit = jest.fn();
    });

    it('should set api and event listener', () => {
      const params: GridReadyEvent = {
        api: {
          addEventListener: jest.fn(),
          showLoadingOverlay: jest.fn(),
        } as unknown as GridApi,
        columnApi: {} as unknown as ColumnApi,
        type: '',
      };
      component.isLoading = true;

      component.onGridReady(params);

      expect(component['gridApi']).toEqual(params.api);
      expect(component['gridColumnApi']).toEqual(params.columnApi);
      expect(params.api.addEventListener).toHaveBeenCalled();
    });

    it('should emit event to expose GridApi', () => {
      const params = {
        api: {
          addEventListener: jest.fn(),
          showNoRowsOverlay: jest.fn(),
        },
      } as unknown as GridReadyEvent;
      component.isLoading = false;

      component.onGridReady(params);

      expect(component.gridReady.emit).toHaveBeenCalledWith(params.api);
    });
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns', () => {
      const params = {
        columnApi: {
          autoSizeAllColumns: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledWith(false);
    });
  });

  describe('getDataPath', () => {
    it('should return predecessors of item', () => {
      const item = new BomItem(
        1,
        'c',
        '003',
        2,
        2,
        'mat',
        2,
        'mat2',
        'type',
        'act',
        2,
        2,
        2,
        2,
        'pc',
        'cost',
        'foreign',
        2,
        'mattérial',
        'parentplant',
        'date',
        'number',
        'version',
        'type',
        'entered',
        'ref',
        'variant',
        1,
        ['root', 'current']
      );

      const result = component.getDataPath(item);

      expect(result).toEqual(item.predecessorsInTree);
    });
  });

  describe('onRowGroupOpened', () => {
    it('should call autosize and redraw', () => {
      component['gridColumnApi'] = {
        autoSizeColumn: jest.fn(),
      } as unknown as ColumnApi;

      component['gridApi'] = {
        redrawRows: jest.fn(),
      } as unknown as GridApi;

      component.onRowGroupOpened();

      expect(component['gridColumnApi'].autoSizeColumn).toHaveBeenCalledWith(
        'ag-Grid-AutoColumn'
      );
      expect(component['gridApi'].redrawRows).toHaveBeenCalledTimes(1);
    });
  });

  describe('onRowClicked', () => {
    const evt = {
      node: {
        id: '2',
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
        node: {
          id: '2',
          parent: {
            id: '1',
          },
          childIndex: 4,
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('second-level-row-4');
    });

    it('should return appropriate third or more row when it is a deeper child', () => {
      component.currentSelectedRow.node.id = '1';
      component.nonLevel2Children = ['3', '4'];

      const params = {
        node: {
          id: '3',
          parent: {
            id: '2',
            childIndex: 2,
            parent: {
              id: '1',
              childIndex: 5,
            },
          },
          childIndex: 3,
        },
      };

      const result = component.getRowClass(params);

      expect(result).toEqual('third-or-more-row-2');
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

  describe('createIndentExcelStyles', () => {
    it('should create fifteen excel styles for all indent levels', () => {
      const result = component.createIndentExcelStyles();

      expect(result.length).toBe(15);
    });

    it('should use string as datatype for all excel styles', () => {
      const result = component.createIndentExcelStyles();

      result.forEach((excelStyle: any) => {
        expect(excelStyle.dataType).toBe('string');
      });
    });

    it('should indent child elements based on their level', () => {
      const result = component.createIndentExcelStyles();

      result.forEach((excelStyle: any, index: number) => {
        expect(excelStyle.alignment.indent).toBe(index + 1);
      });
    });
  });
});
