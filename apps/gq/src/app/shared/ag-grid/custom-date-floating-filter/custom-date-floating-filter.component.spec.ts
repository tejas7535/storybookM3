import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { IFloatingFilterParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LOCALE_DE } from '../../constants';
import { CustomDateFloatingFilterComponent } from './custom-date-floating-filter.component';

describe('CustomDateFloatingFilterComponent', () => {
  let component: CustomDateFloatingFilterComponent;
  let spectator: Spectator<CustomDateFloatingFilterComponent>;

  const createComponent = createComponentFactory({
    component: CustomDateFloatingFilterComponent,
    imports: [
      MatDatepickerModule,
      MatFormFieldModule,
      MatNativeDateModule,
      MatInputModule,
      ReactiveFormsModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [mockProvider(TranslocoLocaleService)],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should set locale', () => {
      component['adapter'].setLocale = jest.fn();
      component['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);

      component.ngOnInit();

      expect(component['adapter'].setLocale).toHaveBeenCalledTimes(1);
      expect(component['adapter'].setLocale).toHaveBeenCalledWith(LOCALE_DE.id);
    });
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params = {
        parentFilterInstance: () => {},
      } as any as IFloatingFilterParams;
      component.agInit(params);

      expect(component['params']).toEqual(params);
    });
  });

  describe('resetDate', () => {
    test('should reset date', () => {
      component['dateFormControl'].setValue = jest.fn();

      component.resetDate();

      expect(component.dateFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.dateFormControl.setValue).toHaveBeenCalledWith(
        undefined
      );
    });
  });
});
