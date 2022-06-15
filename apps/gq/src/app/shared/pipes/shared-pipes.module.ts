import { NgModule } from '@angular/core';

import { DateDisplayPipe } from './date-display/date-display.pipe';
import { GqQuotationPipe } from './gq-quotation/gq-quotation.pipe';
import { MaterialClassificationSOPPipe } from './material-classification-sop/material-classification-sop.pipe';
import { MaterialInfoPipe } from './material-info/material-info.pipe';
import { MaterialTransformPipe } from './material-transform/material-transform.pipe';
import { MillimeterUnitPipe } from './millimeter-unit/millimeter-unit.pipe';
import { MultiSelectPipe } from './multi-select/multi-select.pipe';
import { NullableStringPipe } from './nullable-string/nullable-string.pipe';
import { NumberCurrencyPipe } from './number-currency/number-currency.pipe';
import { PercentagePipe } from './percentage/percentage.pipe';
import { PlantDisplayPipe } from './plant-display/plant-display.pipe';
import { SapQuotationPipe } from './sap-quotation/sap-quotation.pipe';

@NgModule({
  declarations: [
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
    DateDisplayPipe,
    MaterialClassificationSOPPipe,
  ],
  providers: [MaterialTransformPipe],
})
export class SharedPipesModule {}
