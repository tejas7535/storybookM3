import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { MoreInformationDialogComponent } from './more-information-dialog.component';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

describe('MoreInformationDialogComponent', () => {
  let component: MoreInformationDialogComponent;
  let spectator: Spectator<MoreInformationDialogComponent>;

  const createComponent = createComponentFactory({
    component: MoreInformationDialogComponent,
    imports: [CommonModule, MatIconModule, MatDialogModule],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
});
