import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApprovalModalType } from '../../models';
import { ApprovalDecisionModalComponent } from './approval-decision-modal.component';

describe('ApprovalDecisionModalComponent', () => {
  let component: ApprovalDecisionModalComponent;
  let spectator: Spectator<ApprovalDecisionModalComponent>;

  const createComponent = createComponentFactory({
    component: ApprovalDecisionModalComponent,
    imports: [
      MatDialogModule,
      FormsModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          type: ApprovalModalType.APPROVE_CASE,
        },
      },
      {
        provide: MatDialogRef,
        useValue: {},
      },
      FormBuilder,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should call dialogRef.close', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
});
