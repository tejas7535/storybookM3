import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { CustomerMaterialSubstitutionProposalModalComponent } from './customer-material-substitution-proposal-modal.component';

describe('CustomerMaterialSubstitutionProposalModalComponent', () => {
  let spectator: Spectator<CustomerMaterialSubstitutionProposalModalComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialSubstitutionProposalModalComponent,
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        customerNumber: '42',
        materialNumber: '42',
        materialDescription: null,
        demandCharacteristic: null,
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
