import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getGqId } from '@gq/core/store/active-case/active-case.selectors';
import { QuotationMetadataActions } from '@gq/core/store/active-case/quotation-metadata/quotation-metadata.action';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_METADATA_MOCK } from '../../../../../testing/mocks/models/quotation';
import { QuotationNoteModalComponent } from './quotation-note-modal.component';
import { QuotationNoteModalData } from './quotation-note-modal-data.interface';

describe('QuotationNoteModalComponent', () => {
  let component: QuotationNoteModalComponent;
  let spectator: Spectator<QuotationNoteModalComponent>;
  let store: MockStore;
  let actions$: Actions;
  let dialog: MatDialogRef<QuotationNoteModalComponent>;

  const createComponent = createComponentFactory({
    component: QuotationNoteModalComponent,
    imports: [
      MockModule(DialogHeaderModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          isQuotationStatusActive: true,
          quotationMetadata: QUOTATION_METADATA_MOCK,
        } as QuotationNoteModalData,
      },
      {
        provide: MatDialogRef,
        useValue: {},
      },
      provideMockStore(),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    actions$ = spectator.inject(Actions);
    store = spectator.inject(MockStore);
    dialog = spectator.inject(MatDialogRef);
    store.overrideSelector(
      activeCaseFeature.selectQuotationMetadataLoading,
      true
    );
    store.overrideSelector(
      activeCaseFeature.selectQuotationMetadataLoadingErrorMessage,
      undefined as any
    );
    store.overrideSelector(getGqId, 123);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('observables', () => {
    test(
      'should be set correctly',
      marbles((m) => {
        m.expect(component.quotationMetadataLoading$).toBeObservable(
          m.cold('a', { a: true })
        );
        m.expect(component.gqId$).toBeObservable(m.cold('a', { a: 123 }));
      })
    );
  });

  describe('ngOnInit', () => {
    test('should set the form control value', () => {
      component.ngOnInit();

      expect(component.quotationNoteForm.value).toBe(
        QUOTATION_METADATA_MOCK.note
      );
      expect(component.quotationNoteForm.disabled).toBe(false);
    });
    test('should set form control value on empty note', () => {
      component.modalData = {
        isQuotationStatusActive: false,
        quotationMetadata: {
          note: undefined,
        },
      };

      component.ngOnInit();

      expect(component.quotationNoteForm.value).toBe('');
      expect(component.quotationNoteForm.disabled).toBe(true);
    });
  });

  describe('onSave', () => {
    test('should dispatch the updateQuotationMetadata action and not close dialog', () => {
      const dispatchMock = jest.fn();
      component.closeDialog = jest.fn();
      store.dispatch = dispatchMock;

      component.quotationNoteForm.setValue('Test note');

      component.updateQuotationMetadataSuccess$ = of();
      component.onConfirm();

      expect(dispatchMock).toHaveBeenCalledWith({
        type: '[Quotation Metadata] Update Quotation Metadata',
        quotationMetadata: {
          note: 'Test note',
        },
      });
      expect(component.closeDialog).not.toHaveBeenCalled();
    });

    test('should dispatch the updateQuotationMetadata action and close dialog', () => {
      const dispatchMock = jest.fn();
      component.closeDialog = jest.fn();
      store.dispatch = dispatchMock;

      component.quotationNoteForm.setValue('Test note');

      component.updateQuotationMetadataSuccess$ = of(
        QuotationMetadataActions.updateQuotationMetadataSuccess
      );
      component.onConfirm();

      expect(dispatchMock).toHaveBeenCalledWith({
        type: '[Quotation Metadata] Update Quotation Metadata',
        quotationMetadata: {
          note: 'Test note',
        },
      });
      expect(component.closeDialog).toHaveBeenCalledTimes(1);
    });

    describe('onCancel', () => {
      test('should close the dialog', () => {
        component.closeDialog = jest.fn();

        component.onCancel();

        expect(component.closeDialog).toHaveBeenCalledTimes(1);
      });
    });

    describe('closeDialog', () => {
      test('should close the dialog', () => {
        const closeMock = jest.fn();
        dialog.close = closeMock;

        component.closeDialog();

        expect(closeMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
