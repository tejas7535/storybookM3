import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { InternalMaterialReplacementSingleDeleteModalComponent } from './internal-material-replacement-single-delete-modal.component';

describe('InternalMaterialReplacementSingleDeleteModalComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementSingleDeleteModalComponent>;

  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementSingleDeleteModalComponent,
    imports: [],
    providers: [
      mockProvider(SnackbarService),
      mockProvider(IMRService),
      MockProvider(MAT_DIALOG_DATA, {}),
      mockProvider(
        MatDialogRef<InternalMaterialReplacementSingleDeleteModalComponent>
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
