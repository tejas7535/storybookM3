import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { MockProvider } from 'ng-mocks';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import { AgGridLocalizationService } from './../../../../../shared/services/ag-grid-localization.service';
import { Stub } from './../../../../../shared/test/stub.class';
import { CustomerMaterialPortfolioTableComponent } from './customer-material-portfolio-table.component';

describe('CustomerMaterialPortfolioTableComponent', () => {
  let component: CustomerMaterialPortfolioTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerMaterialPortfolioTableComponent>({
      component: CustomerMaterialPortfolioTableComponent,
      providers: [
        MockProvider(CMPService, {
          getCMPCriteriaData: jest.fn().mockReturnValue(
            of({
              filterableFields: [],
              sortableFields: [],
            })
          ),
        }),
        MockProvider(Store, { select: jest.fn().mockReturnValue(of([])) }),
        MockProvider(AgGridLocalizationService),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
