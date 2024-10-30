import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { CustomerMaterialPortfolioTableRowMenuButtonComponent } from './customer-material-portfolio-table-row-menu-button.component';

describe('CustomerMaterialPortfolioTableRowMenuButtonComponent', () => {
  let spectator: Spectator<CustomerMaterialPortfolioTableRowMenuButtonComponent>;

  const createComponent = createComponentFactory({
    component: CustomerMaterialPortfolioTableRowMenuButtonComponent,
    imports: [],
    providers: [mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
