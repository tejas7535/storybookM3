import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../../shared';
import { HorizontalDividerModule } from '../../../../shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialDetailsComponent } from './material-details.component';

@NgModule({
  declarations: [MaterialDetailsComponent],
  imports: [
    MatCardModule,
    SharedModule,
    SharedTranslocoModule,
    SharedPipesModule,
    LabelTextModule,
    HorizontalDividerModule,
  ],
  exports: [MaterialDetailsComponent],
})
export class MaterialDetailsModule {}
