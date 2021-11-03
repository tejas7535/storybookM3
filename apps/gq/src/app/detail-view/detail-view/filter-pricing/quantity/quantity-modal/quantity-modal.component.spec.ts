import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { updateQuotationDetails } from '../../../../../core/store';
import { UpdateQuotationDetail } from '../../../../../core/store/reducers/process-case/models';
import { DialogHeaderModule } from '../../../../../shared/header/dialog-header/dialog-header.module';
import { HelperService } from '../../../../../shared/services/helper-service/helper-service.service';
import { QuantityModalComponent } from './quantity-modal.component';

describe('QuantityModalComponent', () => {
  let component: QuantityModalComponent;
  let spectator: Spectator<QuantityModalComponent>;
  let mockStore: MockStore;
  const createComponent = createComponentFactory({
    component: QuantityModalComponent,
    imports: [
      MatFormFieldModule,
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
      LoadingSpinnerModule,
      DialogHeaderModule,
      ReactiveFormsModule,
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
      { provide: MAT_DIALOG_DATA, useValue: 100 },
      { provide: MatDialogRef, useValue: {} },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should add subscriptions', () => {
      component.addSubscriptions = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnDestroy', () => {
    test('should unsubscribe subscriptions', () => {
      component['subscription'].unsubscribe = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  describe('onKeyPress', () => {
    test('should call HelperService method', () => {
      HelperService.validateQuantityInputKeyPress = jest.fn();

      component.onKeyPress({} as any);
      expect(HelperService.validateQuantityInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });
  });
  describe('onPaste', () => {
    test('should call HelperService method', () => {
      HelperService.validateQuantityInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateQuantityInputPaste).toHaveBeenCalledTimes(1);
    });
  });
  describe('closeDialog', () => {
    test('close Dialog', () => {
      component['dialogRef'].close = jest.fn();
      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });
  describe('selectNewQuantity', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();
      const gqPositionId = '1234';
      const orderQuantity = 10;
      component.gqPositionId = gqPositionId;
      component.quantityFormControl = { value: orderQuantity } as any;
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId,
          orderQuantity,
        },
      ];

      component.selectNewQuantity();

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenLastCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
  });
});
