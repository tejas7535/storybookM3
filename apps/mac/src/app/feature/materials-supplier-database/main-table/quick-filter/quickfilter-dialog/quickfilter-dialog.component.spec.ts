import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../../assets/i18n/en.json';
import { QuickfilterDialogComponent } from './quickfilter-dialog.component';

describe('QuickfilterDialogComponent', () => {
  let component: QuickfilterDialogComponent;
  let spectator: Spectator<QuickfilterDialogComponent>;

  const createComponent = createComponentFactory({
    component: QuickfilterDialogComponent,
    imports: [
      CommonModule,
      MatDialogModule,
      MatIconModule,
      FormsModule,
      MatInputModule,
      MatRadioModule,
      PushModule,
      MatButtonModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en }),
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

  describe('ngOnInit', () => {
    it('should prefil input fields in edit mode', () => {
      const title = 'sth';
      component.data = { title, edit: true, delete: false };
      component.ngOnInit();

      expect(component.edit).toBeTruthy();
      expect(component.delete).toBeFalsy();
      expect(component.titleControl.value).toBe(title);
      expect(component.radioControl.disabled).toBe(true);
      expect(component.radioControl.value).toBe('true');
    });

    it('should prefil input fields in add mode', () => {
      const title = 'sth';
      component.data = { title, edit: false, delete: false };
      component.ngOnInit();

      expect(component.edit).toBeFalsy();
      expect(component.delete).toBeFalsy();
      expect(component.titleControl.value).toBe(title);
    });

    it('should prefil input fields in delete mode', () => {
      const title = 'sth';
      component.data = { title, edit: false, delete: true };
      component.ngOnInit();

      expect(component.edit).toBeFalsy();
      expect(component.delete).toBeTruthy();
      expect(component.titleControl.value).toBe(title);
      expect(component.radioControl.disabled).toBe(true);
    });
  });

  it('closeDialog should close dialog', () => {
    component.dialogRef.close = jest.fn();
    component.closeDialog();
    expect(component.dialogRef.close).toBeCalled();
  });

  describe('applyDialog', () => {
    it('should close dialog and set data for add', () => {
      component.dialogRef.close = jest.fn();
      component.radioControl.setValue('false');
      component.titleControl.setValue('sth');
      component.edit = false;
      component.delete = false;
      component.applyDialog();

      const result = {
        title: 'sth',
        fromCurrent: 'false',
        edit: false,
        delete: false,
      };

      expect(component.dialogRef.close).toBeCalledWith(result);
    });
    it('should close dialog and set data for edit', () => {
      component.dialogRef.close = jest.fn();
      component.radioControl.setValue('false');
      component.titleControl.setValue('edit');
      component.edit = true;
      component.delete = false;
      component.applyDialog();

      const result = {
        title: 'edit',
        fromCurrent: 'false',
        edit: true,
        delete: false,
      };

      expect(component.dialogRef.close).toBeCalledWith(result);
    });
    it('should close dialog and set data for delete', () => {
      component.dialogRef.close = jest.fn();
      component.radioControl.setValue('false');
      component.titleControl.setValue('delete');
      component.edit = false;
      component.delete = true;
      component.applyDialog();

      const result = {
        title: 'delete',
        fromCurrent: 'false',
        edit: false,
        delete: true,
      };

      expect(component.dialogRef.close).toBeCalledWith(result);
    });
  });

  describe('onSubmit', () => {
    it('should close dialog if form is valid', () => {
      component.applyDialog = jest.fn();
      component.titleControl.setValue('test');
      component.onSubmit();

      expect(component.applyDialog).toBeCalled();
    });

    it('should do nothing if form is invalid', () => {
      component.applyDialog = jest.fn();
      component.titleControl.setValue(undefined, { emitEvent: false });
      component.onSubmit();

      expect(component.applyDialog).not.toBeCalled();
    });
  });
});
