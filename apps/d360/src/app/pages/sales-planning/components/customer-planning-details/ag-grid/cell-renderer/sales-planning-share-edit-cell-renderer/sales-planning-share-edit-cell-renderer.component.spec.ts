import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../../../../shared/test/stub.class';
import { CustomerSalesPlanShareEditModalComponent } from '../../../customer-sales-plan-share-edit-modal/customer-sales-plan-share-edit-modal.component';
import { SalesPlanningShareEditCellRendererComponent } from './sales-planning-share-edit-cell-renderer.component';

describe('SalesPlanningShareEditCellRendererComponent', () => {
  let component: SalesPlanningShareEditCellRendererComponent;
  const reloadFn = jest.fn();
  const testParameter = {
    valueFormatted: '10%',
    value: 10,
    node: { level: 0 },
    data: {
      apShareConstrained: 10,
      opShareConstrained: 20,
      spShareConstrained: 30,
    },
    context: {
      reloadData: reloadFn,
    },
  } as ICellRendererParams;

  beforeEach(() => {
    component = Stub.getForEffect({
      component: SalesPlanningShareEditCellRendererComponent,
    });
    component.agInit(testParameter);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setValue', () => {
    it('should show the formatted value', () => {
      component['setValue'](testParameter);
      expect(component['valueFormatted']()).toBe('10%');
      expect(component['value']).toBe(10);
    });
  });

  describe('handleEditShareValueClicked', () => {
    it('should open the dialog', () => {
      jest.spyOn(component['dialog'], 'open');
      component['handleEditShareValueClicked']();
      expect(component['dialog'].open).toHaveBeenCalledWith(
        CustomerSalesPlanShareEditModalComponent,
        {
          data: {
            apShareConstrained: 10,
            opShareConstrained: 20,
            spShareConstrained: 30,
          },
        }
      );
    });

    it('should reload the grid when the dialog returns true', () => {
      const dialogRef = {
        afterClosed: () => of(true),
      } as unknown as MatDialogRef<CustomerSalesPlanShareEditModalComponent>;
      jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRef);
      component['handleEditShareValueClicked']();
      expect(reloadFn).toHaveBeenCalled();
    });

    it('should not reload the grid when the dialog returns false', () => {
      const dialogRef = {
        afterClosed: () => of(false),
      } as unknown as MatDialogRef<CustomerSalesPlanShareEditModalComponent>;
      jest.spyOn(component['dialog'], 'open').mockReturnValue(dialogRef);
      component['handleEditShareValueClicked']();
      expect(reloadFn).not.toHaveBeenCalled();
    });
  });
});
