import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CustomerMaterialNumberCellRendererComponent } from './customer-material-number-cell-renderer.component';

describe('CustomerMaterialNumberCellRendererComponent', () => {
  let spectator: Spectator<CustomerMaterialNumberCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: CustomerMaterialNumberCellRendererComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
