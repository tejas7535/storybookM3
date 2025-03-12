import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { MockProvider } from 'ng-mocks';

import { Stub } from '../../shared/test/stub.class';
import { CustomerMaterialPortfolioComponent } from './customer-material-portfolio.component';

describe('CustomerMaterialPortfolioComponent', () => {
  let component: CustomerMaterialPortfolioComponent;

  beforeEach(() => {
    component = Stub.getForEffect<CustomerMaterialPortfolioComponent>({
      component: CustomerMaterialPortfolioComponent,
      providers: [
        MockProvider(MatDialog),
        MockProvider(Store, { select: jest.fn().mockReturnValue(of([])) }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
