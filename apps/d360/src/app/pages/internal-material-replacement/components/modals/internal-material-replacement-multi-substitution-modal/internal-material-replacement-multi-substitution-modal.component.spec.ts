import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import { InternalMaterialReplacementMultiSubstitutionModalComponent } from './internal-material-replacement-multi-substitution-modal.component';

describe('InternalMaterialReplacementMultiSubstitutionModalComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementMultiSubstitutionModalComponent>;

  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementMultiSubstitutionModalComponent,
    imports: [],
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        isNewSubstitution: false,
        substitution: {},
        gridApi: {},
      }),
      mockProvider(IMRService),
      mockProvider(
        MatDialogRef<InternalMaterialReplacementMultiSubstitutionModalComponent>
      ),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
