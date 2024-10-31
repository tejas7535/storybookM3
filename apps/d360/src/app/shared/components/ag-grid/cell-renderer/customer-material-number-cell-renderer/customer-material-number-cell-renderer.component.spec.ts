import { HttpClient } from '@angular/common/http';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { CustomerMaterialNumberCellRendererComponent } from './customer-material-number-cell-renderer.component';

describe('CustomerMaterialNumberCellRendererComponent', () => {
  let spectator: Spectator<CustomerMaterialNumberCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: CustomerMaterialNumberCellRendererComponent,
    imports: [],
    providers: [mockProvider(HttpClient)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
