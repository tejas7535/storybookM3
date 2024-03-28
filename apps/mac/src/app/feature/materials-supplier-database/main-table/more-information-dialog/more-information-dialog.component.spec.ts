import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { MoreInformationDialogComponent } from './more-information-dialog.component';

describe('MoreInformationDialogComponent', () => {
  let component: MoreInformationDialogComponent;
  let spectator: Spectator<MoreInformationDialogComponent>;

  const createComponent = createComponentFactory({
    component: MoreInformationDialogComponent,
    imports: [provideTranslocoTestingModule({ en })],
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
