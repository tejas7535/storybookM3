import { TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { updateQuotationDetails } from '../../../core/store';
import { DialogHeaderModule } from '../../../shared/components/header/dialog-header/dialog-header.module';
import { EditingCommentModalComponent } from './editing-comment-modal.component';

describe('EditingCommentModalComponent', () => {
  let component: EditingCommentModalComponent;
  let spectator: Spectator<EditingCommentModalComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: EditingCommentModalComponent,
    imports: [
      LoadingSpinnerModule,
      MatFormFieldModule,
      DialogHeaderModule,
      PushModule,
      TextFieldModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
          },
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      { provide: MAT_DIALOG_DATA, useValue: QUOTATION_DETAIL_MOCK },
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
      component.addSubscriptions = jest.fn();

      component.ngOnInit();

      expect(component.commentFormControl).toBeDefined();
      expect(component.updateLoading$).toBeDefined();
      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('addSubscriptions', () => {
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();
      component.addSubscriptions();
      expect(component['subscription'].add).toHaveBeenCalledTimes(2);
    });
  });
  describe('closeDialog', () => {
    test('should close dialogRef', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmComment', () => {
    test('should dispatch store', () => {
      store.dispatch = jest.fn();
      component.modalData = QUOTATION_DETAIL_MOCK;
      component.commentFormControl = { value: 'test' } as any;

      component.confirmComment();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({
          updateQuotationDetailList: [
            {
              gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
              comment: 'test',
            },
          ],
        })
      );
    });
  });

  describe('commentFormControl valueChanges', () => {
    beforeEach(() => {
      component.commentDisabled = true;
      component.modalData.comment = '1';
    });
    test('should set commentDisabled to false', () => {
      component.addSubscriptions();

      component.commentFormControl.setValue('12');
      expect(component.commentDisabled).toBeFalsy();
    });
    test('should set commentDisabled to true', () => {
      component.addSubscriptions();

      component.commentFormControl.setValue('1');
      expect(component.commentDisabled).toBeTruthy();
    });
    test('should set commentDisabled to true when values are undefined', () => {
      component.modalData.comment = undefined;

      component.addSubscriptions();

      component.commentFormControl.setValue(undefined as any);
      expect(component.commentDisabled).toBeTruthy();
    });
  });
});
