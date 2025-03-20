import { Stub } from '../../../../../shared/test/stub.class';
import { MaterialCustomerTableComponent } from './material-customer-table.component';

describe('MaterialCustomerTableComponent', () => {
  let component: MaterialCustomerTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MaterialCustomerTableComponent>({
      component: MaterialCustomerTableComponent,
      providers: [
        Stub.getMaterialCustomerServiceProvider(),
        Stub.getMaterialCustomerTableServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
