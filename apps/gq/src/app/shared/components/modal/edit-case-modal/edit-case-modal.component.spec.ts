import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DialogHeaderComponent } from '../../header/dialog-header/dialog-header.component';
import { EditCaseModalComponent } from './edit-case-modal.component';

describe('EditCaseModalComponent', () => {
  let component: EditCaseModalComponent;
  let spectator: Spectator<EditCaseModalComponent>;

  const createComponent = createComponentFactory({
    component: EditCaseModalComponent,
    imports: [
      MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      EditCaseModalComponent,
      MockComponent(DialogHeaderComponent),
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          caseName: 'case-name',
          currency: 'EUR',
        },
      },
      provideMockStore({
        initialState: {
          currency: {
            availableCurrencies: ['EUR', 'USD'],
          },
        },
      }),
    ],
    detectChanges: false,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should create FormGroup and fill in caseName and currency', () => {
      expect(component.caseModalForm).toBeFalsy();

      spectator.detectChanges();

      expect(component.caseModalForm.controls.caseName.value).toBe('case-name');
      expect(component.caseModalForm.controls.currency.value).toBe('EUR');
    });
  });

  describe('close dialog', () => {
    test('should close dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('submit dialog', () => {
    test('sould submit caseName and currency', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('new-case-name');
      component.caseModalForm.controls.currency.setValue('USD');

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new-case-name',
        currency: 'USD',
      });
    });

    test('should trim case name before submitting', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('   new whitespace ');
      component.caseModalForm.controls.currency.setValue('USD');

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new whitespace',
        currency: 'USD',
      });
    });
  });

  describe('show hint', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should show correct hint for empty name', () => {
      spectator.detectChanges();
      component.caseModalForm.controls.caseName.setValue('');

      spectator.detectChanges();

      const hint = spectator.query('mat-hint');
      expect(hint.textContent).toEqual('0 / 20');
    });

    test('should show correct hint for non-empty name', () => {
      spectator.detectChanges();
      component.caseModalForm.controls.caseName.setValue('Test Case');

      spectator.detectChanges();

      const hint = spectator.query('mat-hint');
      expect(hint.textContent).toEqual('9 / 20');
    });
  });

  describe('set maxLength', () => {
    test('should set maxLength attribute on the input', () => {
      component.NAME_MAX_LENGTH = 10;
      spectator.detectChanges();

      const input = spectator.query('input') as HTMLInputElement;

      expect(input.maxLength).toEqual(10);
    });
  });
});
