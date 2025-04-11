import { ColumnDefinition } from '../../../../shared/services/abstract-column-settings.service';
import { Stub } from './../../../../shared/test/stub.class';
import { MaterialCustomerTableService } from './material-customer-table.service';

describe('MaterialCustomerTableService', () => {
  let service: MaterialCustomerTableService<string, ColumnDefinition<string>>;

  beforeEach(() => {
    service = Stub.get({
      component: MaterialCustomerTableService,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
