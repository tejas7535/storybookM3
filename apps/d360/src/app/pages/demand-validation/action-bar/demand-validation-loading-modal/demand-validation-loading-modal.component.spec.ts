import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { DemandValidationLoadingModalComponent } from './demand-validation-loading-modal.component';

describe('DemandValidationLoadingModalComponent', () => {
  let spectator: Spectator<DemandValidationLoadingModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationLoadingModalComponent,
    imports: [MockModule(LoadingSpinnerModule)],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          textWhileLoading: 'Loading...',
          onInit: jest.fn().mockReturnValue(of(null)),
          onClose: jest.fn(),
        },
      },

      mockProvider(MatDialog, {
        open: () => jest.fn(),
      }),
      mockProvider(MatDialogRef),
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
