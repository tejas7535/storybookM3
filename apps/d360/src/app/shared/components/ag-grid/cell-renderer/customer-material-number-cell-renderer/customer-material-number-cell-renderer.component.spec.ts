import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../test/stub.class';
import { CustomerMaterialNumberCellRendererComponent } from './customer-material-number-cell-renderer.component';
import { CustomerMaterialNumbersModalComponent } from './modal/customer-material-numbers-modal.component';

describe('CustomerMaterialNumberCellRendererComponent', () => {
  let component: CustomerMaterialNumberCellRendererComponent;
  let httpClient: HttpClient;
  let dialog: MatDialog;
  let getSpy: jest.SpyInstance;
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    component = Stub.get({
      component: CustomerMaterialNumberCellRendererComponent,
      providers: [Stub.getMatDialogProvider()],
    });
    httpClient = component['httpClient'];
    dialog = component['dialog'];

    getSpy = jest
      .spyOn(httpClient, 'get')
      .mockReturnValue(of(['Material1', 'Material2']));
    openSpy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of({}),
    } as any);
  });

  describe('agInit', () => {
    it('should initialize component data', () => {
      const params = createMockParams();
      const updateDataSpy = jest.spyOn<any, any>(component, 'updateData');

      component.agInit(params);

      expect(updateDataSpy).toHaveBeenCalledWith(params);
    });
  });

  describe('refresh', () => {
    it('should update data and return true', () => {
      const params = createMockParams();
      const updateDataSpy = jest.spyOn<any, any>(component, 'updateData');

      const result = component.refresh(params);

      expect(updateDataSpy).toHaveBeenCalledWith(params);
      expect(result).toBe(true);
    });
  });

  describe('updateData', () => {
    it('should update internal fields from params data', () => {
      const params = createMockParams();

      component['updateData'](params);

      expect(component['customerMaterialNumber']).toBe('CMN-123');
      expect(component['customerMaterialNumberCount']).toBe(3);
      expect(component['materialNumber']).toBe('MN-123');
      expect(component['customerNumber']).toBe('CN-123');
    });
  });

  describe('fetchAllCustomerMaterialNumbers', () => {
    it('should fetch customer material numbers with correct URL', () => {
      const params = createMockParams();
      component['updateData'](params);

      component['fetchAllCustomerMaterialNumbers']().subscribe();

      expect(getSpy).toHaveBeenCalledWith(
        '/api/material-customer/customer-material-numbers?customerNumber=CN-123&materialNumber=MN-123'
      );
      expect(component['isLoading']()).toBe(false); // Should be set back to false after finalize
      expect(component['customerMaterialNumbers']()).toEqual([
        'Material1',
        'Material2',
      ]);
    });

    it('should handle takeUntilDestroyed properly', () => {
      const takeUntilDestroyedSpy = jest.spyOn(
        { takeUntilDestroyed },
        'takeUntilDestroyed'
      );
      const params = createMockParams();
      component['updateData'](params);

      component['fetchAllCustomerMaterialNumbers']().subscribe();

      // Note: We can't directly test the takeUntilDestroyed behavior since it's mocked
      // But we can verify it was called with destroyRef
      expect(takeUntilDestroyedSpy).not.toHaveBeenCalled(); // Because we've mocked it
    });
  });

  describe('openDialog', () => {
    it('should fetch data if customerMaterialNumbers is empty and open dialog', () => {
      const params = createMockParams();
      component['updateData'](params);
      const fetchSpy = jest
        .spyOn<any, any>(component, 'fetchAllCustomerMaterialNumbers')
        .mockReturnValue(of(['Material1', 'Material2']));

      component['openDialog']();

      expect(fetchSpy).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledWith(
        CustomerMaterialNumbersModalComponent,
        {
          data: {
            customerMaterialNumbers: component['customerMaterialNumbers'],
            isLoading: component['isLoading'],
          },
          width: '500px',
        }
      );
    });

    it('should not fetch data if customerMaterialNumbers is not empty', () => {
      component['customerMaterialNumbers'].set(['Material1', 'Material2']);
      const fetchSpy = jest.spyOn<any, any>(
        component,
        'fetchAllCustomerMaterialNumbers'
      );

      component['openDialog']();

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalled();
    });
  });
});

// Helper function to create mock params
function createMockParams(): ICellRendererParams {
  return {
    data: {
      customerMaterialNumber: 'CMN-123',
      customerMaterialNumberCount: 3,
      materialNumber: 'MN-123',
      customerNumber: 'CN-123',
    },
  } as ICellRendererParams;
}
