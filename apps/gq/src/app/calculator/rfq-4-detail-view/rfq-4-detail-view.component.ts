import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CurrencyModule } from '@gq/core/store/currency/currency.module';
import { provideTranslocoScope } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Rfq4DetailViewHeaderComponent } from './header/rfq-4-detail-view-header.component';
import { InformationComponent } from './information/information.component';
import { RecalculationComponent } from './recalculation/recalculation.component';

@Component({
  selector: 'gq-rfq-4-detail-view',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    Rfq4DetailViewHeaderComponent,
    InformationComponent,
    RecalculationComponent,
    CurrencyModule,
  ],
  providers: [provideTranslocoScope('calculator')],
  templateUrl: './rfq-4-detail-view.component.html',
})
export class Rfq4DetailViewComponent {}
