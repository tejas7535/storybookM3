import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoService } from '@ngneat/transloco';
import { MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReleaseModalComponent } from './release-modal.component';

describe('ReleaseModalComponent', () => {
  let component: ReleaseModalComponent;
  let spectator: Spectator<ReleaseModalComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseModalComponent,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      { provide: MatDialogRef, useValue: {} },
      FormBuilder,
      MockProvider(TranslocoService),
      MockProvider(ApprovalFacade),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAllApprover', () => {
    component.approvalFacade.getApprovers = jest.fn();
    component.ngOnInit();
    expect(component.approvalFacade.getApprovers).toHaveBeenCalled();
  });

  describe('getErrorMessageOfControl', () => {
    beforeEach(() => {
      Object.defineProperty(component, 'REQUIRED_ERROR_MESSAGE', {
        value: 'requiredError',
      });
      Object.defineProperty(component, 'INVALID_APPROVER_ERROR_MESSAGE', {
        value: 'invalidApprover',
      });
    });

    test('should return an errorErrorMessage for required', () => {
      const control: FormControl = new FormControl();
      control.setErrors({ required: true });
      const result = component.getErrorMessageOfControl(control);
      expect(result).toBe('requiredError');
    });
    test('should return an errorErrorMessage for invalid approver', () => {
      const control: FormControl = new FormControl();
      control.setErrors({ invalidApprover: true });
      const result = component.getErrorMessageOfControl(control);
      expect(result).toBe('invalidApprover');
    });
    test('should return empty string when control has no errors', () => {
      const control: FormControl = new FormControl();
      const result = component.getErrorMessageOfControl(control);
      expect(result).toBe('');
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
});
