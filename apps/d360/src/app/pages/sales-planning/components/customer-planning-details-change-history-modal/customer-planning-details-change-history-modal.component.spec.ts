import { of } from 'rxjs';

import { RequestType } from '../../../../shared/components/table';
import { Stub } from '../../../../shared/test/stub.class';
import { CustomerPlanningDetailsChangeHistoryModalComponent } from './customer-planning-details-change-history-modal.component';

describe('CustomerPlanningDetailsChangeHistoryModalComponent', () => {
  let component: CustomerPlanningDetailsChangeHistoryModalComponent;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: CustomerPlanningDetailsChangeHistoryModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          customerNumber: '12345',
          customerName: 'any name',
        }),
      ],
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setColumnDefinitions', () => {
      const setColumnDefinitionsSpy = jest.spyOn(
        component as any,
        'setColumnDefinitions'
      );

      component.ngOnInit();

      expect(setColumnDefinitionsSpy).toHaveBeenCalled();
    });
  });

  describe('getData', () => {
    it('should call changeHistoryService.getChangeHistory with correct parameters', (done) => {
      const mockParams = { startRow: 0, endRow: 10 } as any;
      const mockResponse = { rows: [], rowCount: 0 } as any;
      const changeHistoryServiceSpy = jest
        .spyOn(component['changeHistoryService'], 'getChangeHistory')
        .mockReturnValue(of(mockResponse));

      component['getData$'](mockParams, RequestType.Fetch).subscribe(
        (result) => {
          expect(changeHistoryServiceSpy).toHaveBeenCalledWith(mockParams, {
            customerNumber: ['12345'],
          });
          expect(result).toEqual(mockResponse);
          done();
        }
      );
    });
  });

  describe('setColumnDefinitions', () => {
    it('should call setConfig with column definitions', () => {
      const setConfigSpy = jest.spyOn(component as any, 'setConfig');

      component['setColumnDefinitions']();

      expect(setConfigSpy).toHaveBeenCalled();
    });
  });

  describe('setConfig', () => {
    it('should configure the table with correct settings', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [{ colId: 'testCol', title: 'testCol' }] as any[];

      component['setConfig'](mockColumnDefs);

      expect(configSpy).toHaveBeenCalled();
      const tableConfig = configSpy.mock.calls[0][0];
      expect(tableConfig.table.tableId).toBe(
        'customer-planning-details-change-history'
      );
      expect(tableConfig.hasTabView).toBe(true);
      expect(tableConfig.maxAllowedTabs).toBe(5);
    });

    it('should set up getRowId function correctly', () => {
      const configSpy = jest.spyOn(component['config'], 'set');
      const mockColumnDefs = [{ colId: 'testCol', title: 'testCol' }] as any[];

      component['setConfig'](mockColumnDefs);

      const tableConfig = configSpy.mock.calls[0][0];
      const getRowIdFn = tableConfig.table.getRowId;

      const mockData = {
        data: {
          customerNumber: '12345',
          planningYear: 2023,
          planningMonth: 5,
          planningMaterial: 'ABC123',
          changeTimestamp: '2023-05-01T12:00:00',
        },
      } as any;

      expect(getRowIdFn(mockData)).toBe(
        '12345-2023-5-ABC123-2023-05-01T12:00:00'
      );
    });
  });

  describe('onCancel', () => {
    it('should call close', () => {
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');

      component['onCancel']();

      expect(closeSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('component initialization', () => {
    it('should have correct injected data', () => {
      expect(component.data).toEqual({
        customerNumber: '12345',
        customerName: 'any name',
      });
    });

    it('should properly initialize services', () => {
      expect(component['changeHistoryService']).toBeDefined();
      expect(component['dialogRef']).toBeDefined();
    });
  });
});
