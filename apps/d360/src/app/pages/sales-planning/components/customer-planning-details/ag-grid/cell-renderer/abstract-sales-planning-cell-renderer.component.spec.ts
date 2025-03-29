import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../feature/sales-planning/model';
import { Stub } from '../../../../../../shared/test/stub.class';
import { AbstractSalesPlanningCellRendererComponent } from './abstract-sales-planning-cell-renderer.component';

class TestComponent extends AbstractSalesPlanningCellRendererComponent<number> {
  protected setValue(
    parameters: ICellRendererParams<DetailedCustomerSalesPlan, number>
  ) {
    this.parameters = parameters;
  }
}

let component: AbstractSalesPlanningCellRendererComponent<number>;
const testParams: ICellRendererParams = {
  data: { editStatus: '1' },
  valueFormatted: '1%',
} as ICellRendererParams;
describe('AlertRuleTableRowMenuButtonComponent', () => {
  beforeEach(() => {
    component = Stub.get({ component: TestComponent });
  });

  it('should set the defaults', () => {
    component.agInit(testParams);
    expect(component['valueFormatted']()).toEqual('1%');
    expect(component['editStatus']()).toEqual('1');
  });
});
