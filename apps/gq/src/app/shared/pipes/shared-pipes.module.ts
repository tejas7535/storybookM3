import { NgModule } from '@angular/core';

import { UserDisplayPipe } from '@gq/process-case-view/release-button/release-modal/user-display/user-display.pipe';

import { DateDisplayPipe } from './date-display/date-display.pipe';
import { GqQuotationPipe } from './gq-quotation/gq-quotation.pipe';
import { IsDashOrEmptyStringPipe } from './is-dash-or-empty-string/is-dash-or-empty-string.pipe';
import { MaterialClassificationSOPPipe } from './material-classification-sop/material-classification-sop.pipe';
import { MaterialInfoPipe } from './material-info/material-info.pipe';
import { MaterialTransformPipe } from './material-transform/material-transform.pipe';
import { MillimeterUnitPipe } from './millimeter-unit/millimeter-unit.pipe';
import { MultiSelectPipe } from './multi-select/multi-select.pipe';
import { MultiplyComparableCostWithPriceUnitPipe } from './multiply-comparable-cost-with-price-unit/multiply-comparable-cost-with-price-unit.pipe';
import { MultiplyWithPriceUnitPipe } from './multiply-with-price-unit/multiply-with-price-unit.pipe';
import { NullableStringPipe } from './nullable-string/nullable-string.pipe';
import { NumberCurrencyPipe } from './number-currency/number-currency.pipe';
import { PercentagePipe } from './percentage/percentage.pipe';
import { PlantDisplayPipe } from './plant-display/plant-display.pipe';
import { SapQuotationPipe } from './sap-quotation/sap-quotation.pipe';
import { UomPipe } from './uom/uom.pipe';
@NgModule({
  declarations: [
    UserDisplayPipe,
    GqQuotationPipe,
    MaterialInfoPipe,
    MaterialTransformPipe,
    NumberCurrencyPipe,
    PlantDisplayPipe,
    SapQuotationPipe,
    PercentagePipe,
    MultiSelectPipe,
    MillimeterUnitPipe,
    NullableStringPipe,
    DateDisplayPipe,
    MaterialClassificationSOPPipe,
    UomPipe,
    IsDashOrEmptyStringPipe,
    MultiplyComparableCostWithPriceUnitPipe,
    MultiplyWithPriceUnitPipe,
  ],
  imports: [],
  exports: [
    GqQuotationPipe,
    MaterialInfoPipe,
    MaterialTransformPipe,
    NumberCurrencyPipe,
    PlantDisplayPipe,
    SapQuotationPipe,
    PercentagePipe,
    MultiSelectPipe,
    MillimeterUnitPipe,
    NullableStringPipe,
    UomPipe,
    DateDisplayPipe,
    MaterialClassificationSOPPipe,
    IsDashOrEmptyStringPipe,
    MultiplyComparableCostWithPriceUnitPipe,
    MultiplyWithPriceUnitPipe,
    UserDisplayPipe,
  ],
  providers: [MaterialTransformPipe],
})
export class SharedPipesModule {}
