import { Stub } from '../../../../../shared/test/stub.class';
import { CustomerSalesPlanShareEditModalComponent } from './customer-sales-plan-share-edit-modal.component';

describe('CustomerSalesPlanShareEditModalComponent', () => {
  let component: CustomerSalesPlanShareEditModalComponent;

  beforeEach(() => {
    component = Stub.get({
      component: CustomerSalesPlanShareEditModalComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
