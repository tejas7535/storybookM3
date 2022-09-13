import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
      component.data = { title, edit: true };
      component.ngOnInit();

      expect(component.titleControl.value).toBe(title);
      expect(component.radioControl.disabled).toBe(true);
      expect(component.radioControl.value).toBe('true');
    });

    it('should NOT prefil input fields in edit mode', () => {
      const title = 'sth';
      component.data = { title, edit: false };
      component.ngOnInit();

      expect(component.titleControl.value).toBeFalsy();
      expect(component.radioControl.disabled).toBe(false);
    });
  });

  it('closeDialog should close dialog', () => {
    component.dialogRef.close = jest.fn();
    component.closeDialog();
    expect(component.dialogRef.close).toBeCalled();
  });

  it('applyDialog should close dialog and set data', () => {
    component.dialogRef.close = jest.fn();
    component.radioControl.setValue('false');
    component.titleControl.setValue('sth');
    component.data.edit = false;
    component.applyDialog();

    const result = {
      title: 'sth',
      fromCurrent: 'false',
    };

    expect(component.dialogRef.close).toBeCalledWith(result);
  });
});
