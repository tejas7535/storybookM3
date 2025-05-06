import { GridReadyEvent } from 'ag-grid-enterprise';

import { Stub } from '../../../../shared/test/stub.class';
import { CustomerPlanningDetailsChangeHistoryModalComponent } from './customer-planning-details-change-history-modal.component';

describe('CustomerPlanningDetailsChangeHistoryModalComponent', () => {
  let component: CustomerPlanningDetailsChangeHistoryModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: CustomerPlanningDetailsChangeHistoryModalComponent,
      providers: [Stub.getMatDialogDataProvider({})],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onGridReady', () => {
    it('should initialize columns and set datasource', () => {
      jest.spyOn(component as any, 'createColumnDefs');
      jest.spyOn(component as any, 'setServerSideDatasource');
      component['onGridReady']({} as GridReadyEvent);
      expect(component['createColumnDefs']).toHaveBeenCalled();
      expect(component['setServerSideDatasource']).toHaveBeenCalled();
    });
  });
  describe('createColumnDefs', () => {
    it('should create the columns from backend settings', () => {
      jest
        .spyOn(component['columnSettingsService'], 'getDefaultColumns')
        .mockReturnValue([]);
      (component as any).gridApi = {
        setGridOption: jest.fn(() => 0),
      };
      component['createColumnDefs']();
      expect(component['gridApi'].setGridOption).toHaveBeenCalledWith(
        'columnDefs',
        []
      );
    });
  });

  describe('setServerSideDatasource', () => {
    it('should set the datasource', () => {
      (component as any).gridApi = {
        setGridOption: jest.fn(() => 0),
      };
      component['setServerSideDatasource']();
      expect(component['gridApi'].setGridOption).toHaveBeenCalledWith(
        'serverSideDatasource',
        { getRows: expect.any(Function) }
      );
    });
  });

  describe('onCancel', () => {
    it('should close the dialog', () => {
      const dialogSpy = jest.spyOn(component['dialogRef'], 'close');
      component['onCancel']();
      expect(dialogSpy).toHaveBeenCalled();
    });
  });

  describe('onDataUpdated', () => {
    beforeEach(() => {
      component['gridApi'] = Stub.getGridApi();
    });

    it('should show no rows overlay if displayed row count is 0', () => {
      jest
        .spyOn(component['gridApi'], 'getDisplayedRowCount')
        .mockReturnValue(0);
      jest.spyOn(component['gridApi'], 'showNoRowsOverlay');

      component['onDataUpdated']();

      expect(component['gridApi'].showNoRowsOverlay).toHaveBeenCalled();
    });

    it('should hide overlay if displayed row count is greater than 0', () => {
      jest
        .spyOn(component['gridApi'], 'getDisplayedRowCount')
        .mockReturnValue(1);
      jest.spyOn(component['gridApi'], 'hideOverlay');

      component['onDataUpdated']();

      expect(component['gridApi'].hideOverlay).toHaveBeenCalled();
    });

    it('should not throw an error if gridApi is not defined', () => {
      component['gridApi'] = undefined;

      expect(() => component['onDataUpdated']()).not.toThrow();
    });
  });
});
