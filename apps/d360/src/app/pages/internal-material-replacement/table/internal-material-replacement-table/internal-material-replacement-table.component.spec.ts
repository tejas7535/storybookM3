import {
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';

import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { IMRSubstitution } from '../../../../feature/internal-material-replacement/model';
import { Stub } from '../../../../shared/test/stub.class';
import { InternalMaterialReplacementSingleDeleteModalComponent } from '../../components/modals/internal-material-replacement-single-delete-modal/internal-material-replacement-single-delete-modal.component';
import { InternalMaterialReplacementSingleSubstitutionModalComponent } from '../../components/modals/internal-material-replacement-single-substitution-modal/internal-material-replacement-single-substitution-modal.component';
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
    (component as any)['selectedRegion'] = jest.fn().mockReturnValue('region1');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('context', () => {
    it('should return the correct menu items for edit and delete', () => {
      const params = {
        data: {
          customerNumber: '123',
          predecessorMaterial: '456',
          region: '789',
          salesArea: '012',
          salesOrg: '345',
        },
      } as ICellRendererParams<any, IMRSubstitution>;

      const editSpy = jest.spyOn(component as any, 'edit');
      const deleteSpy = jest.spyOn(component as any, 'delete');

      const menu = component['context'].getMenu(params);

      expect(menu).toHaveLength(2);

      expect(menu[0].text).toBe('button.edit');
      menu[0].onClick();
      expect(editSpy).toHaveBeenCalledWith(params);

      expect(menu[1].text).toBe('button.delete');
      menu[1].onClick();
      expect(deleteSpy).toHaveBeenCalledWith(params);
    });
  });

  describe('onGridReady', () => {
    it('should set gridApi and call setServerSideDatasource', () => {
      const mockGridApi: GridApi = Stub.getGridApi();
      jest.spyOn(component as any, 'setServerSideDatasource');

      const event = { api: mockGridApi } as GridReadyEvent;

      component['onGridReady'](event);

      expect(component.gridApi).toBe(mockGridApi);
      expect(component['setServerSideDatasource']).toHaveBeenCalledWith(
        'region1'
      );
    });

    it('should handle null gridApi gracefully', () => {
      const event = { api: null } as GridReadyEvent;
      expect(() => component['onGridReady'](event)).not.toThrow();
    });
  });

  describe('setServerSideDatasource', () => {
    it('should set serverSideDatasource with selectedRegion', () => {
      const mockGridApi = Stub.getGridApi();
      component.gridApi = mockGridApi;

      component['setServerSideDatasource']('region1');

      expect(mockGridApi.setGridOption).toHaveBeenCalledWith(
        'serverSideDatasource',
        expect.any(Function)
      );
    });

    it('should handle null gridApi gracefully', () => {
      component.gridApi = null;
      expect(() =>
        component['setServerSideDatasource']('region1')
      ).not.toThrow();
    });
  });

  describe('edit', () => {
    it('should open the edit dialog and update the grid on success', () => {
      const params = {
        data: {},
        api: Stub.getGridApi(),
      } as any;

      component['edit'](params);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        InternalMaterialReplacementSingleSubstitutionModalComponent,
        {
          data: {
            substitution: params.data,
            isNewSubstitution: false,
            gridApi: params.api,
          },
          panelClass: ['form-dialog', 'internal-material-replacement'],
          disableClose: true,
          autoFocus: false,
        }
      );
    });
  });

  describe('delete', () => {
    it('should open the delete dialog and update the grid on success', () => {
      const mockGridApi = {
        applyServerSideTransaction: jest.fn(),
      };
      const params = {
        data: {},
        api: mockGridApi,
      } as any;

      component['delete'](params);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        InternalMaterialReplacementSingleDeleteModalComponent,
        {
          data: params.data,
          autoFocus: false,
          disableClose: true,
        }
      );
    });
  });

  describe('onFirstDataRendered', () => {
    it('should auto size all columns', () => {
      const mockGridApi = {
        autoSizeAllColumns: jest.fn(),
      } as any;
      const event = { api: mockGridApi } as FirstDataRenderedEvent;

      component['onFirstDataRendered'](event);

      expect(mockGridApi.autoSizeAllColumns).toHaveBeenCalled();
    });
  });

  describe('updateColumnDefs', () => {
    it('should set column definitions', () => {
      const mockGridApi = Stub.getGridApi();
      component.gridApi = mockGridApi;

      component['updateColumnDefs']();

      expect(mockGridApi.setGridOption).toHaveBeenCalledWith(
        'columnDefs',
        expect.any(Array)
      );
    });
  });

  describe('getRowId', () => {
    it('should return the concatenated id of the row', () => {
      const params = {
        data: {
          customerNumber: '123',
          predecessorMaterial: '456',
          region: '789',
          salesArea: '012',
          salesOrg: '345',
        },
      } as any;
      const rowId = component['getRowId'](params);
      expect(rowId).toBe('123-456-789-012-345');
    });

    it('should handle missing data fields gracefully', () => {
      const params = {
        data: {
          customerNumber: '123',
          predecessorMaterial: null,
          region: '789',
          salesArea: undefined,
          salesOrg: '345',
        },
      } as any;
      const rowId = component['getRowId'](params);
      expect(rowId).toBe('123--789--345');
    });

    it('should return a string with empty fields if data is null', () => {
      const params = { data: null } as any;
      const rowId = component['getRowId'](params);
      expect(rowId).toBe('----');
    });

    it('should return a string with empty fields if data is undefined', () => {
      const params = { data: undefined } as any;
      const rowId = component['getRowId'](params);
      expect(rowId).toBe('----');
    });
  });
});
