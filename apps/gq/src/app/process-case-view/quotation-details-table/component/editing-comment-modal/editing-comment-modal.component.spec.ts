import { TextFieldModule } from '@angular/cdk/text-field';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BehaviorSubject } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockDirective } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { EditingCommentModalComponent } from './editing-comment-modal.component';
describe('EditingCommentModalComponent', () => {
  let component: EditingCommentModalComponent;
  let spectator: Spectator<EditingCommentModalComponent>;

  const quotationEditableSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  const loadingStoppedSubject$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  const loadingErrorMessageSubject$$: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  const createComponent = createComponentFactory({
    component: EditingCommentModalComponent,
    imports: [
      LoadingSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      DialogHeaderModule,
      PushPipe,
      TextFieldModule,
      ReactiveFormsModule,
      MockDirective(DragDialogDirective),
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
        useValue: {
          close: jest.fn(),
        },
      },
      { provide: MAT_DIALOG_DATA, useValue: QUOTATION_DETAIL_MOCK },
      {
        provide: ActiveCaseFacade,
        useValue: {
          updateQuotationDetails: jest.fn(),
          quotationDetailUpdating$: loadingStoppedSubject$$.asObservable(),
          loadingErrorMessage$: loadingErrorMessageSubject$$.asObservable(),
          canEditQuotation$: quotationEditableSubject$$.asObservable(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should add subscriptions', () => {
      jest.restoreAllMocks();
      component.addSubscriptions = jest.fn();

      component.ngOnInit();

      expect(component.commentFormControl).toBeDefined();
      expect(component.updateLoading$).toBeDefined();
      expect(component.addSubscriptions).toHaveBeenCalled();
    });
  });

  describe('should disable/enable commentFormControl', () => {
    test('should enable commentFormControl', () => {
      component.quotationIsEditable$ =
        quotationEditableSubject$$.asObservable();
      quotationEditableSubject$$.next(true);

      expect(component.commentFormControl.enabled).toBeTruthy();
    });
    test('should disable commentFormControl', () => {
      component.quotationIsEditable$ =
        quotationEditableSubject$$.asObservable();
      quotationEditableSubject$$.next(false);

      expect(component.commentFormControl.disabled).toBeTruthy();
    });
  });
  describe('addSubscriptions', () => {
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();
      component.addSubscriptions();
      expect(component['subscription'].add).toHaveBeenCalled();
    });

    test('should close dialog when loading stopped and no error message', () => {
      component.closeDialog = jest.fn();

      loadingStoppedSubject$$.next(true);
      loadingStoppedSubject$$.next(false);
      loadingErrorMessageSubject$$.next('');

      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
  describe('closeDialog', () => {
    test('should close dialogRef', () => {
      jest.resetAllMocks();
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmComment', () => {
    test('should dispatch store', () => {
      component.modalData = QUOTATION_DETAIL_MOCK;
      component.commentFormControl = { value: 'test' } as any;

      component.confirmComment();

      expect(
        component['activeCaseFacade'].updateQuotationDetails
      ).toHaveBeenCalledWith([
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          comment: 'test',
        },
      ]);
    });
  });

  describe('commentFormControl valueChanges', () => {
    beforeEach(() => {
      component.commentDisabled = true;
      component.modalData.comment = '1';
    });
    test('should set commentDisabled to false when empty string', () => {
      component.addSubscriptions();

      component.commentFormControl.setValue('');
      expect(component.commentDisabled).toBeFalsy();
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
