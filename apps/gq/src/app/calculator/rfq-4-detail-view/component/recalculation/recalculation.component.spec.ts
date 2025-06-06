import { CalculatorDetailsInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/calculator-details/calculator-details-input.component';
import { CommentInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/comment/comment-input.component';
import { CurrencyInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/currency/currency-input.component';
import { DeliveryTimeInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/delivery-time/delivery-time-input.component';
import { LotSizeInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/lot-size/lot-size-input.component';
import { PriceUnitInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/price-unit/price-unit-input.component';
import { ProdPlantInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/prod-plant/prod-plant-input.component';
import { SqvInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/sqv/sqv-input.component';
import { ToolCostInputComponent } from '@gq/calculator/rfq-4-detail-view/component/recalculation/control/tool-cost/tool-cost-input.component';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
    providers: [MockProvider(TranslocoLocaleService)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
