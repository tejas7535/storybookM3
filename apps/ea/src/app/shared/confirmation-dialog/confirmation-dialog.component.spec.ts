import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let spectator: Spectator<ConfirmationDialogComponent>;

  const createComponent = createComponentFactory({
    component: ConfirmationDialogComponent,
    imports: [
      CommonModule,
      MatDialogModule,
      MatIconModule,
      MatButtonModule,
      ReactiveFormsModule,
    ],
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

  it('closeDialog should close dialog', () => {
    component.dialogRef.close = jest.fn();
    component.closeDialog();

    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  describe('applyDialog', () => {
    it('should close dialog and set data for delete', () => {
      component.dialogRef.close = jest.fn();
      component.applyDialog();

      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
