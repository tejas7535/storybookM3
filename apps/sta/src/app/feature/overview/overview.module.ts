import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { IconModule } from '@schaeffler/shared/ui-components';

import { OverviewRoutingModule } from './overview-routing.module';

import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    IconModule,
    MatCardModule,
    OverviewRoutingModule,
    RouterModule
  ],
  exports: [OverviewComponent]
})
export class OverviewModule {}
