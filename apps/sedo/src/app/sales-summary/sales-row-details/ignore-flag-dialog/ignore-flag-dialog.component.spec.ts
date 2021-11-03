import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator';

import { IgnoreFlag } from '../enums/ignore-flag.enum';
import { IgnoreFlagDialogComponent } from './ignore-flag-dialog.component';

describe('IgnoreFlagDialogComponent', () => {
  let component: IgnoreFlagDialogComponent;
  let spectator: Spectator<IgnoreFlagDialogComponent>;
  let dialogRef: SpyObject<MatDialogRef<IgnoreFlagDialogComponent>>;

  const createComponent = createComponentFactory({
    component: IgnoreFlagDialogComponent,
    declarations: [IgnoreFlagDialogComponent],
    imports: [MatDialogModule, MatButtonModule, MatSelectModule],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      { provide: MAT_DIALOG_DATA, useValue: IgnoreFlag.None },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dialogRef = spectator.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancel', () => {
    it('should close the dialog', () => {
      component.cancel();

      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
