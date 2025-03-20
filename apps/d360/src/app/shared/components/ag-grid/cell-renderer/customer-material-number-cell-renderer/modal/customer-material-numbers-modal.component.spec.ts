import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { Stub } from './../../../../../test/stub.class';
import { CustomerMaterialNumbersModalComponent } from './customer-material-numbers-modal.component';

describe('CustomerMaterialNumbersDialogComponent', () => {
  let spectator: Spectator<CustomerMaterialNumbersModalComponent>;

  const createComponent = createComponentFactory({
    component: CustomerMaterialNumbersModalComponent,
    imports: [],
    providers: [
      Stub.getMatDialogDataProvider({
        isLoading: jest.fn(),
        customerMaterialNumbers: jest.fn(),
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
