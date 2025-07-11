import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BetaFeatureDialogComponent } from './beta-feature-dialog.component';

describe('BetaFeatureDialogComponent', () => {
  let component: BetaFeatureDialogComponent;
  let spectator: Spectator<BetaFeatureDialogComponent>;

  const createComponent = createComponentFactory({
    component: BetaFeatureDialogComponent,
    imports: [
      MatDialogModule,
      MockModule(MatIconModule),
      MockModule(MatButtonModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should close dialog when onClose is called', () => {
      const closeSpy = jest
        .spyOn(component['dialogRef'], 'close')
        .mockImplementation();
      component.onClose();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});
