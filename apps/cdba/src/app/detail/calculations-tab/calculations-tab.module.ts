import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { CalculationsTableModule } from '@cdba/shared/components';

import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [
    SharedModule,
    CalculationsTabRoutingModule,
    MatCardModule,
    SharedTranslocoModule,
    CalculationsTableModule,
  ],
})
export class CalculationsTabModule {}
