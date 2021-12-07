import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../../shared';
import { HorizontalDividerModule } from '../../../../shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialDetailsComponent } from './material-details.component';
import { MaterialSalesOrgDetailsComponent } from './material-sales-org-details/material-sales-org-details.component';

@NgModule({
  declarations: [MaterialDetailsComponent, MaterialSalesOrgDetailsComponent],
  imports: [
    MatCardModule,
    SharedModule,
    SharedTranslocoModule,
    SharedPipesModule,
    LabelTextModule,
    HorizontalDividerModule,
    ReactiveComponentModule,
  ],
  exports: [MaterialDetailsComponent],
})
export class MaterialDetailsModule {}
