import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../testing/mocks';
import {
  clearProcessCaseRowData,
  resetAllAutocompleteOptions,
} from '../../core/store';
import { AutocompleteInputModule } from '../../shared/components/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../shared/components/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/components/case-material/input-table/input-table.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('AddMaterialDialogComponent', () => {
  let component: AddMaterialDialogComponent;
  let spectator: Spectator<AddMaterialDialogComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AddMaterialDialogComponent,
    declarations: [AddMaterialDialogComponent],
    imports: [
      AddEntryModule,
      InputTableModule,
      AgGridModule,
      AutocompleteInputModule,
      LoadingSpinnerModule,
      MatCardModule,
      MatDialogModule,
      MatIconModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
      MatSnackBarModule,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
          processCase: { quotation: {}, addMaterials: {} },
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();

      component.ngOnInit();

      expect(component.rowData$).toBeDefined();
      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  describe('closeDialog', () => {
    test('should close dialog', () => {
      store.dispatch = jest.fn();

      component['dialogRef'].close = jest.fn();
      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(clearProcessCaseRowData());
      expect(store.dispatch).toHaveBeenCalledWith(
        resetAllAutocompleteOptions()
      );
    });
  });
});
