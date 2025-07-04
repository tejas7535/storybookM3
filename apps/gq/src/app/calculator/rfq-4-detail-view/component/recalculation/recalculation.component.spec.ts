import { signal } from '@angular/core';

import { CalculatorDetailsInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/calculator-details/calculator-details-input.component';
import { CommentInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/comment/comment-input.component';
import { CurrencyInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/currency/currency-input.component';
import { DeliveryTimeInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/delivery-time/delivery-time-input.component';
import { LotSizeInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/lot-size/lot-size-input.component';
import { PriceUnitInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/price-unit/price-unit-input.component';
import { ProdPlantInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/prod-plant/prod-plant-input.component';
import { SqvInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/sqv/sqv-input.component';
import { ToolCostInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/tool-cost/tool-cost-input.component';
import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CALCULATOR_QUOTATION_DETAIL_DATA_MOCK,
  RFQ_CALCULATION_DATA,
} from '../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { RecalculationComponent } from './recalculation.component';

describe('RecalculationComponent', () => {
  let component: RecalculationComponent;
  let spectator: Spectator<RecalculationComponent>;

  const createComponent = createComponentFactory({
    component: RecalculationComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponents(
        SqvInputComponent,
        CurrencyInputComponent,
        LotSizeInputComponent,
        PriceUnitInputComponent,
        CommentInputComponent,
        CalculatorDetailsInputComponent,
        ToolCostInputComponent,
        ProdPlantInputComponent,
        DeliveryTimeInputComponent
      ),
    ],
    providers: [
      MockProvider(TranslocoLocaleService),
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          saveRfq4DetailViewCalculationData: signal(RFQ_CALCULATION_DATA),
          confirmRfq4DetailViewCalculationData: signal(RFQ_CALCULATION_DATA),
          getRfq4DetailViewCalculationData: signal(RFQ_CALCULATION_DATA),
          getQuotationDetailData: signal(CALCULATOR_QUOTATION_DETAIL_DATA_MOCK),
          setCalculationDataStatus: signal('INVALID'),
          confirmRecalculationTriggered: signal(true),
        },
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

  describe('isFormInvalid', () => {
    test('should return true when at least one form is touched and invalid', () => {
      const controls = component.recalculationForm.controls;

      // Simulate a control being touched and invalid
      controls['currency'].markAsTouched();
      controls['currency'].setErrors({ required: true });

      expect(component.isFormInvalid()).toBeTruthy();
    });

    test('should return false when no control is touched', () => {
      expect(component.isFormInvalid()).toBeFalsy();
    });
  });

  describe('submit', () => {
    test('should call saveRfq4DetailViewCalculationData with correct data', () => {
      const store = spectator.inject(Rfq4DetailViewStore);
      const saveSpy = jest.spyOn(store, 'saveRfq4DetailViewCalculationData');
      component.recalculationForm.controls['prodPlant'].setValue({
        id: '0078',
      } as SelectableValue);

      component.submit();

      expect(saveSpy).toHaveBeenCalledWith(RFQ_CALCULATION_DATA);
    });
  });

  describe('confirm', () => {
    beforeEach(() => {
      component['prepareRfq4DetailViewCalculationData'] = jest.fn(
        () => RFQ_CALCULATION_DATA
      );
      component.recalculationForm.patchValue(RFQ_CALCULATION_DATA);
      component.recalculationForm.updateValueAndValidity();
    });
    test('should do nothing when form is invalid', () => {
      const store = spectator.inject(Rfq4DetailViewStore);
      const confirmSpy = jest.spyOn(
        store,
        'confirmRfq4DetailViewCalculationData'
      );

      component.recalculationForm.controls['currency'].setErrors({
        required: true,
      });

      component['confirm']();

      expect(confirmSpy).not.toHaveBeenCalled();
    });
    test('should call confirm calculation data', () => {
      const store = spectator.inject(Rfq4DetailViewStore);
      const confirmSpy = jest.spyOn(
        store,
        'confirmRfq4DetailViewCalculationData'
      );

      component.recalculationForm.controls['prodPlant'].setValue({
        id: '0078',
      } as SelectableValue);

      component['confirm']();

      expect(confirmSpy).toHaveBeenCalled();
    });
  });
});
