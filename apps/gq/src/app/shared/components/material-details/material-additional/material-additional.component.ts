import { Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../label-text/label-text.module';

@Component({
  selector: 'gq-material-additional',
  templateUrl: './material-additional.component.html',
  imports: [
    LabelTextModule,
    SharedPipesModule,
    SharedTranslocoModule,
    LetDirective,
  ],
})
export class MaterialAdditionalComponent {
  @Input() quotationDetail: QuotationDetail;
}
