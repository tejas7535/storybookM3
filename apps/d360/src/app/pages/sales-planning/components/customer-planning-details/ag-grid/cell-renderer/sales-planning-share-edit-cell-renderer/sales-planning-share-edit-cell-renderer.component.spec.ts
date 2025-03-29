import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../../../../shared/test/stub.class';
import { CustomerSalesPlanShareEditModalComponent } from '../../../customer-sales-plan-share-edit-modal/customer-sales-plan-share-edit-modal.component';
import { SalesPlanningShareEditCellRendererComponent } from './sales-planning-share-edit-cell-renderer.component';

describe('SalesPlanningShareEditCellRendererComponent', () => {
  let component: SalesPlanningShareEditCellRendererComponent;
  const testParameter = {
    valueFormatted: '10%',
    value: 10,
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

  it('should show the formatted value', () => {
    component['setValue'](testParameter);
    expect(component['value']).toBe(10);
  });

  it('should open the dialog', () => {
    jest.spyOn(component['dialog'], 'open');
    component['handleEditShareValueClicked']();
    expect(component['dialog'].open).toHaveBeenCalledWith(
      CustomerSalesPlanShareEditModalComponent
    );
  });
});
