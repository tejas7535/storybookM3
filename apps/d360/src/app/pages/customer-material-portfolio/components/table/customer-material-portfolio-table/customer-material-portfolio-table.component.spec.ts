import { of } from 'rxjs';

import {
  RequestType,
  TableCreator,
} from '../../../../../shared/components/table';
import { Stub } from '../../../../../shared/test/stub.class';
import { CustomerMaterialPortfolioTableComponent } from './customer-material-portfolio-table.component';

describe('CustomerMaterialPortfolioTableComponent', () => {
  let component: CustomerMaterialPortfolioTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerMaterialPortfolioTableComponent>({
      component: CustomerMaterialPortfolioTableComponent,
      providers: [Stub.getCMPServiceProvider(), Stub.getStoreProvider()],
    });
    component['gridApi'] = Stub.getGridApi();

    Stub.setInputs([
      { property: 'selectedCustomer', value: { customerNumber: '12345' } },
      { property: 'globalSelection', value: {} },
      { property: 'refreshCounter', value: 0 },
      { property: 'openSingleDialog', value: jest.fn() },
      { property: 'toggleIsActive', value: false },
    ]);

    Stub.detectChanges();
  });

  it('should create the component', () => {
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

  describe('ngOnInit', () => {
    it('should call fetchCriteriaData', () => {
      const fetchCriteriaDataSpy = jest.spyOn(
        component as any,
        'fetchCriteriaData'
      );
      component.ngOnInit();
      expect(fetchCriteriaDataSpy).toHaveBeenCalled();
    });

    it('should fetch criteria data on initialization', () => {
      const fetchCriteriaDataSpy = jest.spyOn<any, any>(
        component,
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

    it('should update criteriaData with fetched data', () => {
      const mockCriteriaData = { field1: 'value1' } as any;
      jest
        .spyOn(component['cmpService'], 'getCMPCriteriaData')
        .mockReturnValue(of(mockCriteriaData));

      component['fetchCriteriaData']();

      expect(component['criteriaData']()).toEqual(mockCriteriaData);
    });
  });

  describe('getData', () => {
    it('should return empty rows if global selection is empty', () => {
      jest
        .spyOn(component['globalSelectionStateService'], 'isEmpty')
        .mockReturnValue(true);

      component['getData$']({} as any, RequestType.Fetch).subscribe(
        (result) => {
          expect(result).toEqual({ rows: [], rowCount: 0 });
        }
      );
    });

    it('should return cached materials if group key exists in materialCache', () => {
      const mockParams = { groupKeys: ['material1'] } as any;
      component['materialCache'].set('material1', [
        {
          region: 'EU',
          tlMessageType: '',
          tlMessage: '',
          tlMessageNumber: 0,
          tlMessageId: '',
          tlMessageV1: '',
          tlMessageV2: '',
          tlMessageV3: '',
          tlMessageV4: '',
        },
      ]);

      component['getData$'](mockParams, RequestType.GroupClick).subscribe(
        (result) => {
          expect(result).toEqual({ rows: [{ id: 1 }], rowCount: 1 });
        }
      );
    });

    it('should fetch data from cmpService if group key does not exist in materialCache', () => {
      const mockParams = { groupKeys: ['material2'], columnFilters: [] } as any;
      const cmpServiceSpy = jest
        .spyOn(component['cmpService'], 'getCMPData')
        .mockReturnValue(
          of({
            childOfHeadMaterial: { material2: [{ id: 2 }] },
            headMaterials: [{ id: 3 }],
          } as any)
        );

      component['getData$'](mockParams, RequestType.GroupClick).subscribe(
        (result) => {
          expect(cmpServiceSpy).toHaveBeenCalled();
          expect(result).toEqual([{ id: 3 }]);
          expect(component['materialCache'].get('material2')).toEqual([
            { id: 2 },
          ]);
        }
      );
    });
  });

  describe('handleExpandAllChange', () => {
    it('should expand all rows when toggle is checked', () => {
      const gridApiSpy = jest.spyOn(component['gridApi'], 'expandAll');
      component['handleExpandAllChange']({ checked: true } as any);

      expect(component['showChains']).toBe(true);
      expect(gridApiSpy).toHaveBeenCalled();
    });

    it('should collapse all rows when toggle is unchecked', () => {
      const gridApiSpy = jest.spyOn(component['gridApi'], 'collapseAll');
      component['handleExpandAllChange']({ checked: false } as any);

      expect(component['showChains']).toBe(false);
      expect(gridApiSpy).toHaveBeenCalled();
    });
  });

  describe('constructor', () => {
    it('should clear materialCache and refresh gridApi when refreshCounter changes', () => {
      const refreshSpy = jest.spyOn(component['gridApi'], 'refreshServerSide');
      Stub.setInput('refreshCounter', 1);
      Stub.detectChanges();

      expect(component['materialCache'].size).toBe(0);
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should update showChains when toggleIsActive changes', () => {
      Stub.setInput('toggleIsActive', true);
      Stub.detectChanges();

      expect(component['showChains']).toBe(true);
    });

    it('should call setColumnDefinitions when selectedCustomer or globalSelection changes', () => {
      const reloadSpy = jest.spyOn<any, any>(component['reload$'](), 'next');

      Stub.setInput('selectedCustomer', { customerNumber: '67890' });
      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('handleDataFetchedEvent', () => {
    it('should expand all rows if showChains is true', () => {
      component['showChains'] = true;
      const gridApiSpy = jest.spyOn(component['gridApi'], 'expandAll');

      component['handleDataFetchedEvent']();

      expect(gridApiSpy).toHaveBeenCalled();
    });

    it('should not expand rows if showChains is false', () => {
      component['showChains'] = false;
      const gridApiSpy = jest.spyOn(component['gridApi'], 'expandAll');

      component['handleDataFetchedEvent']();

      expect(gridApiSpy).not.toHaveBeenCalled();
    });
  });

  describe('setConfig', () => {
    it('should set the table configuration with column definitions', () => {
      const mockColumnDefs = [
        { field: 'materialNumber', headerName: 'Material Number' },
      ];
      const tableCreatorSpy = jest.spyOn(TableCreator, 'get');

      component['setConfig'](mockColumnDefs);

      expect(tableCreatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          table: expect.objectContaining({
            tableId: 'customer-material-portfolio',
            columnDefs: [
              {
                columnDefs: mockColumnDefs,
                layoutId: 0,
                title: 'table.defaultTab',
              },
            ],
          }),
        })
      );
    });

    it('should configure the context menu with allowed actions', () => {
      const mockColumnDefs = [] as any;
      const mockParams = {
        node: {
          data: {
            portfolioStatus: 'SE',
            successorSchaefflerMaterial: true,
          },
        },
      } as any;

      component['setConfig'](mockColumnDefs);

      const data = component['config']().table.context.getMenu(mockParams);

      expect(data).toEqual([
        {
          onClick: expect.any(Function),
          text: 'customer.material_portfolio.modal.action.EDIT',
        },
        {
          onClick: expect.any(Function),
          text: 'customer.material_portfolio.modal.action.SUBSTITUTION_TO_SCHAEFFLER',
        },
      ]);
    });

    it('should disable actions if the user is not authorized', () => {
      const mockColumnDefs = [] as any;
      jest.spyOn(component as any, 'backendRoles').mockReturnValue([]);

      component['setConfig'](mockColumnDefs);

      expect(component['config']().table.context.isDisabled()).toBe(true);
    });

    it('should correctly configure getRowId function', () => {
      const mockColumnDefs = [] as any;

      component['setConfig'](mockColumnDefs);

      const getRowId = component['config']().table.getRowId;
      const result = getRowId({
        data: { customerNumber: '123', materialNumber: '456' },
      } as any);

      expect(result).toBe('123-456');
    });

    it('should set up serverSideAutoGroup with correct configuration', () => {
      const mockColumnDefs = [] as any;

      component['setConfig'](mockColumnDefs);

      const serverSideAutoGroup =
        component['config']().table.serverSideAutoGroup;

      expect(serverSideAutoGroup.autoGroupColumnDef.field).toBe(
        'materialNumber'
      );
      expect(serverSideAutoGroup.autoGroupColumnDef.pinned).toBe('left');
      expect(serverSideAutoGroup.isServerSideGroup({ hasChildren: true })).toBe(
        true
      );
      expect(
        serverSideAutoGroup.isServerSideGroup({ hasChildren: false })
      ).toBe(false);
      expect(
        serverSideAutoGroup.getServerSideGroupKey({ materialNumber: 'M123' })
      ).toBe('M123');
    });

    it('should configure onFirstDataRendered callback to call handleDataFetchedEvent', () => {
      const mockColumnDefs = [] as any;
      const handleDataFetchedEventSpy = jest.spyOn(
        component as any,
        'handleDataFetchedEvent'
      );

      component['setConfig'](mockColumnDefs);

      component['config']().callbacks.onFirstDataRendered(undefined as any);

      expect(handleDataFetchedEventSpy).toHaveBeenCalled();
    });

    it('should call openSingleDialog when menu item is clicked', () => {
      const mockColumnDefs = [] as any;
      const mockParams = {
        node: {
          data: {
            portfolioStatus: 'SE',
            successorSchaefflerMaterial: true,
          },
        },
      } as any;
      const openSingleDialogSpy = jest.fn();
      (component as any)['openSingleDialog'] = () => openSingleDialogSpy;

      component['setConfig'](mockColumnDefs);

      const menuItems = component['config']().table.context.getMenu(mockParams);
      expect(menuItems.length).toBeGreaterThan(0);

      menuItems[0].onClick();

      expect(openSingleDialogSpy).toHaveBeenCalledWith(
        'EDIT_MODAL',
        mockParams.node.data,
        undefined
      );
    });
  });
});
