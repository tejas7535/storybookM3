import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { OverviewRoutingModule } from './overview-routing.module';

import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    FlexLayoutModule,
    MatIconModule,
    OverviewRoutingModule,
    RouterModule
  ],
  exports: [OverviewComponent]
})
export class OverviewModule {}
