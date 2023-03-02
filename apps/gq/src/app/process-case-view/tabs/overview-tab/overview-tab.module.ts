import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OverviewTabComponent } from './overview-tab.component';
import { OverviewTabRoutingModule } from './overview-tab.routing.module';

@NgModule({
  imports: [CommonModule, OverviewTabRoutingModule, SharedTranslocoModule],
  declarations: [OverviewTabComponent],
})
export class OverviewTabModule {}
