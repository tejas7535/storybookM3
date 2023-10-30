import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { of, Subject } from 'rxjs';

import { resetAllAutocompleteOptions } from '@gq/core/store/actions';
import { ProcessCaseActions } from '@gq/core/store/process-case';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CREATE_CASE_STORE_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../testing/mocks';
import { AddMaterialDialogComponent } from './add-material-dialog.component';

describe('AddMaterialDialogComponent', () => {
  let component: AddMaterialDialogComponent;
  let spectator: Spectator<AddMaterialDialogComponent>;
  let store: MockStore;

  let beforeClosed: () => Subject<boolean>;
  let mockSubjectClose: Subject<boolean>;

  const createComponent = createComponentFactory({
    component: AddMaterialDialogComponent,
    declarations: [AddMaterialDialogComponent],
    imports: [PushModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {
          beforeClosed: jest.fn(() => of(beforeClosed)),
        } as unknown as MatDialogRef<AddMaterialDialogComponent>,
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    mockSubjectClose = new Subject<boolean>();
    beforeClosed = () => mockSubjectClose;

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
      expect(component['subscription'].add).toHaveBeenCalledTimes(2);
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
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
    test('should call dispatch reset actions', () => {
      store.dispatch = jest.fn();
      component['dialogRef'].close = jest.fn();
      component['dialogRef'].beforeClosed().subscribe((_value) => {
        expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          ProcessCaseActions.clearRowData()
        );
        expect(store.dispatch).toHaveBeenCalledWith(
          resetAllAutocompleteOptions()
        );
      });
      component.closeDialog();
      mockSubjectClose.next(true);
    });
  });
});
