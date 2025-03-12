import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { Stub } from '../../../../../shared/test/stub.class';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
import { MaterialCustomerTableComponent } from './material-customer-table.component';

describe('MaterialCustomerTableComponent', () => {
  let component: MaterialCustomerTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<MaterialCustomerTableComponent>({
      component: MaterialCustomerTableComponent,
      providers: [
        MockProvider(
          MaterialCustomerService,
          {
            getCriteriaData: jest.fn().mockReturnValue(
              of({
                filterableFields: [],
                sortableFields: [],
              })
            ),
          },
          'useValue'
        ),
        MockProvider(
          MaterialCustomerTableService,
          {
            useMaterialCustomerColumnLayouts: jest.fn(),
            createMaterialCustomerDatasource: jest.fn(),
          },
          'useValue'
        ),
        MockProvider(
          AgGridLocalizationService,
          {
            lang: jest.fn(),
          },
          'useValue'
        ),
        MockProvider(HttpClient, { get: () => of({}) }, 'useValue'),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
