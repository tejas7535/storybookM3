import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { GlobalSelectionHelperService } from '../../feature/global-selection/global-selection.service';
import { CustomerMaterialPortfolioComponent } from './customer-material-portfolio.component';

describe('CustomerMaterialPortfolioComponent', () => {
  let spectator: Spectator<CustomerMaterialPortfolioComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialPortfolioComponent,
    providers: [
      mockProvider(MatDialog),
      mockProvider(GlobalSelectionHelperService, {
        getCustomersData: jest.fn().mockReturnValue(of([])),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
