import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AddCustomViewModalComponent } from './add-custom-view-modal.component';

describe('AddCustomViewModalComponent', () => {
  let component: AddCustomViewModalComponent;
  let spectator: Spectator<AddCustomViewModalComponent>;

  const createComponent = createComponentFactory({
    component: AddCustomViewModalComponent,
    imports: [
      MatFormFieldModule,
      MatRadioModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
      DialogHeaderModule,
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          createNewView: true,
        },
      },
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should add createFromDefault formControl if createNewView is TRUE', () => {
      component.modalData = {
        createNewView: true,
        showRadioButtons: true,
      };

      component.ngOnInit();

      expect(component.formGroup.controls['name']).toBeTruthy();
      expect(component.formGroup.controls['createFromDefault']).toBeTruthy();
    });

    test('should NOT add createFromDefault formControl if createNewView is FALSE', () => {
      component.modalData = {
        createNewView: false,
        showRadioButtons: false,
      };

      component.ngOnInit();

      expect(component.formGroup.controls['name']).toBeTruthy();
      expect(component.formGroup.controls['createFromDefault']).toBeFalsy();
    });
  });

  describe('close dialog', () => {
    test('should close dialogRef', () => {
      component['dialogRef'].close = jest.fn();
      component.ngOnInit();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('save', () => {
    test('should close and emit form values for edit dialog', () => {
      component.modalData = {
        createNewView: false,
        showRadioButtons: false,
      };

      component['dialogRef'].close = jest.fn();
      component.ngOnInit();
      component.formGroup.setValue({
        name: 'test-name',
      });

      component.save();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        name: 'test-name',
        createFromDefault: undefined,
        createNewView: false,
      });
    });

    test('should close and emit form values for create from scratch', () => {
      component.modalData = {
        createNewView: true,
        showRadioButtons: true,
      };

      component['dialogRef'].close = jest.fn();
      component.ngOnInit();
      component.formGroup.setValue({
        name: 'test-name',
        createFromDefault: true,
      });

      component.save();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        name: 'test-name',
        createFromDefault: true,
        createNewView: true,
      });
    });

    test('should close and emit form values for create from current view', () => {
      component.modalData = {
        createNewView: true,
        showRadioButtons: true,
      };

      component['dialogRef'].close = jest.fn();
      component.ngOnInit();
      component.formGroup.setValue({
        name: 'test-name',
        createFromDefault: false,
      });

      component.save();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        name: 'test-name',
        createFromDefault: false,
        createNewView: true,
      });
    });
  });
});
