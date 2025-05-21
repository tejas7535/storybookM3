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

  describe('onCancel', () => {
    it('should call close', () => {
      const closeSpy = jest.spyOn(component['dialogRef'], 'close');

      component['onCancel']();

      expect(closeSpy).toHaveBeenCalledWith(null);
    });
  });
});
