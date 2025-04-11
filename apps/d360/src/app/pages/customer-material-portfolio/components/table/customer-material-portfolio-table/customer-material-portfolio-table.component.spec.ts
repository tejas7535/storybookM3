import { signal } from '@angular/core';

import { of } from 'rxjs';

import { GetRowIdParams, ICellRendererParams } from 'ag-grid-enterprise';

import { statusActions } from '../status-actions';
import { CMPEntry } from './../../../../../feature/customer-material-portfolio/model';
import { ActionsMenuCellRendererComponent } from './../../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { Stub } from './../../../../../shared/test/stub.class';
import { CustomerMaterialPortfolioTableComponent } from './customer-material-portfolio-table.component';

describe('CustomerMaterialPortfolioTableComponent', () => {
  let component: CustomerMaterialPortfolioTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerMaterialPortfolioTableComponent>({
      component: CustomerMaterialPortfolioTableComponent,
      providers: [Stub.getCMPServiceProvider(), Stub.getStoreProvider()],
    });
    component['gridApi'] = Stub.getGridApi();

    Stub.setInput('selectedCustomer', { customerNumber: 'abc-123' });
    Stub.setInput('globalSelection', {});
    Stub.setInput('filterModel', {});
    Stub.setInput('refreshCounter', 0);
    Stub.setInput('openSingleDialog', jest.fn());
    Stub.setInput('toggleIsActive', false);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('authorizedToChange', () => {
    it('should return false if backendRoles is null', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue(null);

      const result = component['authorizedToChange']();

      expect(result).toBe(false);
    });

    it('should return false if backendRoles is empty', () => {
      jest.spyOn(component as any, 'backendRoles').mockReturnValue([]);

      const result = component['authorizedToChange']();

      expect(result).toBe(false);
    });
  });

  describe('getRowIdFn', () => {
    it('should return the correct row ID based on customerNumber and materialNumber', () => {
      const params = {
        data: {
          customerNumber: 'cust-001',
          materialNumber: 'mat-001',
        },
      } as GetRowIdParams;

      const result = component['getRowIdFn'](params);

      expect(result).toBe('cust-001-mat-001');
    });

    it('should return a different row ID for different customerNumber and materialNumber', () => {
      const params = {
        data: {
          customerNumber: 'cust-002',
          materialNumber: 'mat-002',
        },
      } as GetRowIdParams;

      const result = component['getRowIdFn'](params);

      expect(result).toBe('cust-002-mat-002');
    });

    it('should handle empty customerNumber and materialNumber', () => {
      const params = {
        data: {
          customerNumber: '',
          materialNumber: '',
        },
      } as GetRowIdParams;

      const result = component['getRowIdFn'](params);

      expect(result).toBe('-');
    });
  });

  describe('context', () => {
    describe('isDisabled', () => {
      it('should return true if authorizedToChange is false', () => {
        (component as any)['authorizedToChange'] = signal(false);
        expect(component['context'].isDisabled()).toBe(true);
      });

      it('should return false if authorizedToChange is true', () => {
        (component as any)['authorizedToChange'] = signal(true);
        expect(component['context'].isDisabled()).toBe(false);
      });
    });

    describe('getMenu', () => {
      it('should return filtered and mapped actions based on portfolioStatus and successorSchaefflerMaterial', () => {
        const params = {
          node: {
            data: {
              portfolioStatus: 'someStatus',
              successorSchaefflerMaterial: 'someMaterial',
            },
          },
        } as ICellRendererParams<any, CMPEntry>;

        const mockActions = [
          {
            name: 'action1',
            isAllowed: jest.fn().mockReturnValue(true),
            modal: 'modal1',
            changeToStatus: 'status1',
          },
        ] as any;

        jest
          .spyOn(component, 'openSingleDialog')
          .mockReturnValue(signal(jest.fn()));
        jest.spyOn(statusActions, 'filter').mockReturnValue(mockActions);

        const result = component['context'].getMenu(params);

        expect(result).toEqual([
          {
            text: 'customer.material_portfolio.modal.action.action1',
            onClick: expect.any(Function),
          },
        ]);

        result[0].onClick();
        expect(component.openSingleDialog).toHaveBeenCalled();
      });

      it('should return an empty array if no actions are allowed', () => {
        const params = {
          node: {
            data: {
              portfolioStatus: 'someStatus',
              successorSchaefflerMaterial: 'someMaterial',
            },
          },
        } as ICellRendererParams<any, CMPEntry>;

        const mockActions = [] as any;

        jest.spyOn(statusActions, 'filter').mockReturnValue(mockActions);

        const result = component['context'].getMenu(params);

        expect(result).toEqual([]);
      });
    });
  });

  describe('getServerSideGroup', () => {
    it('should return true if data has children', () => {
      const data = { hasChildren: true };
      const result = component['getServerSideGroup'](data);
      expect(result).toBe(true);
    });

    it('should return false if data does not have children', () => {
      const data = { hasChildren: false };
      const result = component['getServerSideGroup'](data);
      expect(result).toBe(false);
    });
  });

  describe('getServerSideGroupOpenByDefault', () => {
    it('should return false', () => {
      const result = component['getServerSideGroupOpenByDefault'](null);
      expect(result).toBe(false);
    });
  });

  describe('getServerSideGroupKey', () => {
    it('should return material number', () => {
      const data = { materialNumber: '123' };
      const result = component['getServerSideGroupKey'](data);
      expect(result).toBe('123');
    });
  });

  describe('ngOnInit', () => {
    it('should call fetchCriteriaData', () => {
      const fetchCriteriaDataSpy = jest.spyOn(
        component as any,
        'fetchCriteriaData'
      );
      component.ngOnInit();
      expect(fetchCriteriaDataSpy).toHaveBeenCalled();
    });
  });

  describe('fetchCriteriaData', () => {
    it('should set criteriaData correctly', () => {
      const criteriaData = { filterableFields: [], sortableFields: [] } as any;
      jest
        .spyOn(component['cmpService'], 'getCMPCriteriaData')
        .mockReturnValue(of(criteriaData));
      component['fetchCriteriaData']();
      expect(component['criteriaData']()).toEqual(criteriaData);
    });
  });

  describe('initializeColumnDefs', () => {
    it('should initialize column definitions with correct structure', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      jest
        .spyOn(component['selectableOptionsService'].loading$, 'pipe')
        .mockReturnValue(of(false));

      component['initializeColumnDefs']();

      expect(setGridOptionSpy).toHaveBeenCalledWith(
        'columnDefs',
        expect.arrayContaining([
          {
            cellClass: ['fixed-action-column'],
            field: 'menu',
            headerName: '',
            cellRenderer: ActionsMenuCellRendererComponent,
            lockVisible: true,
            pinned: 'right',
            lockPinned: true,
            suppressHeaderMenuButton: true,
            maxWidth: 64,
            suppressSizeToFit: true,
          },
        ])
      );
    });

    it('should not set column definitions if loading is true', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );
      setGridOptionSpy.mockClear();
      jest
        .spyOn(component['selectableOptionsService'].loading$, 'pipe')
        .mockReturnValue(of(true));

      component['initializeColumnDefs']();

      expect(setGridOptionSpy).not.toHaveBeenCalledWith(
        'columnDefs',
        expect.anything()
      );
    });
  });

  describe('handleExpandAllChange', () => {
    it('should expand all rows when showChains is true', () => {
      component['handleExpandAllChange']({ checked: true } as any);
      expect(component['gridApi'].expandAll).toHaveBeenCalledWith();
    });

    it('should collapse all rows when showChains is false', () => {
      component['handleExpandAllChange']({ checked: false } as any);
      expect(component['gridApi'].collapseAll).toHaveBeenCalledWith();
    });
  });

  describe('onGridReady', () => {
    it('should set gridApi and call setServerSideDatasource and handleDataFetchedEvents', () => {
      const setServerSideDatasourceSpy = jest
        .spyOn(component as any, 'setServerSideDatasource')
        .mockImplementation(() => {});
      const handleDataFetchedEventsSpy = jest
        .spyOn(component as any, 'handleDataFetchedEvents')
        .mockImplementation(() => {});
      const gridApi = Stub.getGridApi();

      component['onGridReady']({ api: gridApi } as any);

      expect(component['gridApi']).toBe(gridApi);
      expect(setServerSideDatasourceSpy).toHaveBeenCalledWith();
      expect(handleDataFetchedEventsSpy).toHaveBeenCalledWith();
    });
  });

  describe('setServerSideDatasource', () => {
    it('should set serverSideDatasource correctly', () => {
      const setGridOptionSpy = jest.spyOn(
        component['gridApi'],
        'setGridOption'
      );

      jest
        .spyOn(
          component['cmpService'],
          'createCustomerMaterialPortfolioDatasource'
        )
        .mockReturnValue({ foo: 'bar' } as any);

      component['setServerSideDatasource']();

      expect(setGridOptionSpy).toHaveBeenCalledWith('serverSideDatasource', {
        foo: 'bar',
      } as any);
    });
  });

  describe('handleDataFetchedEvents', () => {
    it('should update rowCount and show/hide overlay correctly', () => {
      const showNoRowsOverlaySpy = jest.spyOn(
        component['gridApi'],
        'showNoRowsOverlay'
      );
      const hideOverlaySpy = jest.spyOn(component['gridApi'], 'hideOverlay');
      const expandAllSpy = jest.spyOn(component['gridApi'], 'expandAll');

      jest
        .spyOn(component['cmpService'], 'getDataFetchedEvent')
        .mockReturnValue(of({ headMaterials: { rowCount: 1 } } as any));

      component['showChains'] = true;

      component['handleDataFetchedEvents']();

      expect(component['rowCount']()).toBe(1);
      expect(hideOverlaySpy).toHaveBeenCalled();
      expect(showNoRowsOverlaySpy).not.toHaveBeenCalled();
      expect(expandAllSpy).toHaveBeenCalled();
    });

    it('should show no rows overlay when rowCount is 0', () => {
      const showNoRowsOverlaySpy = jest.spyOn(
        component['gridApi'],
        'showNoRowsOverlay'
      );
      jest
        .spyOn(component['cmpService'], 'getDataFetchedEvent')
        .mockReturnValue(of({ headMaterials: { rowCount: 0 } } as any));
      component['handleDataFetchedEvents']();
      expect(component['rowCount']()).toBe(0);
      expect(showNoRowsOverlaySpy).toHaveBeenCalled();
    });

    it('should call nothing, if no gridAPI is available', () => {
      component['gridApi'] = null;

      jest
        .spyOn(component['cmpService'], 'getDataFetchedEvent')
        .mockReturnValue(of({ headMaterials: { rowCount: 1 } } as any));

      component['showChains'] = true;

      component['handleDataFetchedEvents']();

      expect(component['rowCount']()).toBe(1);
    });
  });

  describe('onFirstDataRendered', () => {
    it('should auto size all columns', () => {
      const autoSizeAllColumnsSpy = jest.fn();
      component['onFirstDataRendered']({
        api: { autoSizeAllColumns: autoSizeAllColumnsSpy },
      } as any);
      expect(autoSizeAllColumnsSpy).toHaveBeenCalled();
    });
  });
});
