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
          getRfq4DetailViewCalculationData: signal(RFQ_CALCULATION_DATA),
          getQuotationDetailData: signal(CALCULATOR_QUOTATION_DETAIL_DATA_MOCK),
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
});
