import { Component, Input } from '@angular/core';

import { MaterialDetails } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../label-text/label-text.module';

@Component({
  selector: 'gq-dimension-details',
  standalone: true,
  imports: [LabelTextModule, SharedPipesModule, SharedTranslocoModule],
  templateUrl: './dimension-details.component.html',
})
export class DimensionDetailsComponent {
  @Input() materialDetails: MaterialDetails;
}
