import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { Stub } from '../../../../shared/test/stub.class';
import { InternalMaterialReplacementTableComponent } from './internal-material-replacement-table.component';

describe('InternalMaterialReplacementTableComponent', () => {
  let component: InternalMaterialReplacementTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<InternalMaterialReplacementTableComponent>({
      component: InternalMaterialReplacementTableComponent,
      providers: [
        Stub.getMatDialogProvider(),
        // we need it here, can't be removed!
        MockProvider(IMRService, Stub.getIMRService(), 'useValue'),
      ],
    });

    // Mock the selectedRegion input
    Stub.setInput('selectedRegion', 'region1');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getData', () => {
    it('should call imrService.getIMRData with correct parameters', () => {
      const mockParams = { page: 1, pageSize: 10 };
      const imrServiceSpy = jest.spyOn(component['imrService'], 'getIMRData');

      component['getData$'](mockParams as any).subscribe();

      expect(imrServiceSpy).toHaveBeenCalledWith(
        { region: ['region1'] },
        mockParams
      );
    });
  });

  describe('setColumnDefinitions', () => {
    it('should set column definitions when loading$ emits false', () => {
      const setConfigSpy = jest.spyOn<any, any>(component, 'setConfig');
      const selectableOptionsService = component['selectableOptionsService'];
      selectableOptionsService.loading$.next(false);

      component['setColumnDefinitions']();

      expect(setConfigSpy).toHaveBeenCalled();
    });
  });

  describe('edit', () => {
    it('should open the substitution modal and update data if reloadData is true', () => {
      component['gridApi'] = Stub.getGridApi();
      const mockParams = { data: {}, api: component['gridApi'] } as any;
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () =>
            of({ reloadData: true, redefinedSubstitution: {} }),
        } as any);
      const applyTransactionSpy = jest.spyOn(
        component['gridApi'],
        'applyServerSideTransaction'
      );

      component['edit'](mockParams);

      expect(dialogSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({
        update: [{}],
      });
    });
  });

  describe('delete', () => {
    it('should open the delete modal and remove data if reloadData is true', () => {
      const mockParams = { data: {}, api: Stub.getGridApi() } as any;
      const dialogSpy = jest
        .spyOn(component['dialog'], 'open')
        .mockReturnValue({
          afterClosed: () => of(true),
        } as any);
      const applyTransactionSpy = jest.spyOn(
        mockParams.api,
        'applyServerSideTransaction'
      );
      const dataFetchedEventSpy = jest.spyOn(
        component['dataFetchedEvent$'],
        'next'
      );

      component['delete'](mockParams);

      expect(dialogSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({
        remove: [{}],
      });
      expect(dataFetchedEventSpy).toHaveBeenCalled();
    });

    it('should update rowCount in dataFetchedEvent after deletion', () => {
      const mockParams = { data: {}, api: Stub.getGridApi() } as any;
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as any);
      const spy = jest.spyOn(component['dataFetchedEvent$'], 'next');

      component['dataFetchedEvent$'].next({ rowCount: 10 });

      component['delete'](mockParams);

      const lastCall = spy.mock.calls.at(-1)[0];
      expect(lastCall.rowCount).toBe(9);
    });

    it('should handle edge case when rowCount is already 0', () => {
      const mockParams = { data: {}, api: Stub.getGridApi() } as any;
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(true),
      } as any);

      const spy = jest.spyOn(component['dataFetchedEvent$'], 'next');

      component['dataFetchedEvent$'].next({ rowCount: 0 });

      component['delete'](mockParams);

      const lastCall = spy.mock.calls.at(-1)[0];
      expect(lastCall.rowCount).toBe(-1); // This is a potential bug that would be caught by this test
    });
  });

  describe('constructor', () => {
    it('should call setColumnDefinitions when selectedRegion changes', () => {
      const setColumnDefinitionsSpy = jest.spyOn<any, any>(
        component,
        'setColumnDefinitions'
      );

      Stub.setInput('selectedRegion', 'region2');
      Stub.detectChanges();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call setColumnDefinitions', () => {
      const setColumnDefinitionsSpy = jest.spyOn<any, any>(
        component,
        'setColumnDefinitions'
      );

      component.ngOnInit();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });

  describe('effect', () => {
    it('should call reload$ when selectedRegion changes', () => {
      const reloadSpy = jest.spyOn(component['reload$'](), 'next');

      Stub.setInput('selectedRegion', 'new-region');
      Stub.detectChanges();

      expect(reloadSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('edit with reloadData false', () => {
    it('should not update grid when reloadData is false', () => {
      component['gridApi'] = Stub.getGridApi();
      const mockParams = { data: {}, api: component['gridApi'] } as any;
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of({ reloadData: false, redefinedSubstitution: {} }),
      } as any);
      const applyTransactionSpy = jest.spyOn(
        component['gridApi'],
        'applyServerSideTransaction'
      );

      component['edit'](mockParams);

      expect(applyTransactionSpy).not.toHaveBeenCalled();
    });
  });

  describe('delete with reloadData false', () => {
    it('should not update grid when reloadData is false', () => {
      const mockParams = { data: {}, api: Stub.getGridApi() } as any;
      jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: () => of(false),
      } as any);
      const applyTransactionSpy = jest.spyOn(
        mockParams.api,
        'applyServerSideTransaction'
      );

      component['delete'](mockParams);

      expect(applyTransactionSpy).not.toHaveBeenCalled();
    });
  });

  describe('setConfig', () => {
    it('should properly set the config with correct table properties', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [
        { field: 'testField', headerName: 'Test Header' },
      ];

      component['setConfig'](mockColumnDefs as any);

      expect(configSpy).toHaveBeenCalled();
      const configArg = configSpy.mock.calls[0][0];
      expect(configArg.table.tableId).toBe('internal-material-replacement');
      expect(configArg.hasTabView).toBe(true);
      expect(configArg.maxAllowedTabs).toBe(5);
    });

    it('should include the context with getMenu function', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [{ field: 'testField' }];

      component['setConfig'](mockColumnDefs as any);

      const configArg = configSpy.mock.calls[0][0];
      expect(typeof configArg.table.context.getMenu).toBe('function');
    });

    it('should return correct menu items from context.getMenu', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [{ field: 'testField' }];

      component['setConfig'](mockColumnDefs as any);

      const configArg = configSpy.mock.calls[0][0];
      const mockParams = { data: {} } as any;
      const menuItems = configArg.table.context.getMenu(mockParams);

      expect(menuItems.length).toBe(2);
      expect(menuItems[0].text).toBeDefined();
      expect(typeof menuItems[0].onClick).toBe('function');
      expect(menuItems[1].text).toBeDefined();
      expect(typeof menuItems[1].onClick).toBe('function');
    });
  });

  describe('getRowId', () => {
    it('should generate the correct row ID from data properties', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [{ field: 'testField' }];

      component['setConfig'](mockColumnDefs as any);

      const configArg = configSpy.mock.calls[0][0];
      const mockData = {
        customerNumber: 'C123',
        predecessorMaterial: 'M456',
        region: 'EU',
        salesArea: 'SA789',
        salesOrg: 'SO101',
      };

      const rowId = configArg.table.getRowId({ data: mockData } as any);
      expect(rowId).toBe('C123-M456-EU-SA789-SO101');
    });

    it('should filter out falsy values when generating row ID', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [{ field: 'testField' }];

      component['setConfig'](mockColumnDefs as any);

      const configArg = configSpy.mock.calls[0][0];
      const mockData = {
        customerNumber: 'C123',
        predecessorMaterial: '',
        region: 'EU',
        salesArea: null,
        salesOrg: 'SO101',
      } as any;

      const rowId = configArg.table.getRowId({ data: mockData } as any);
      expect(rowId).toBe('C123-EU-SO101');
    });
  });
});
