import { NgModule } from '@angular/core';

import { GqQuotationPipe } from './gq-quotation/gq-quotation.pipe';
import { MaterialInfoPipe } from './material-info/material-info.pipe';
import { MaterialTransformPipe } from './material-transform/material-transform.pipe';
import { NumberCurrencyPipe } from './number-currency/number-currency.pipe';
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
  ],
  imports: [],
  exports: [
    GqQuotationPipe,
    MaterialInfoPipe,
    MaterialTransformPipe,
    NumberCurrencyPipe,
    PlantDisplayPipe,
    SapQuotationPipe,
  ],
})
export class SharedPipesModule {}
