import { UpperCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BetaFeatureModule } from '../beta-feature/beta-feature.module';
import { TabsHeaderComponent } from './tabs-header.component';

@NgModule({
  declarations: [TabsHeaderComponent],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    UpperCasePipe,
    MatTabsModule,
    SharedTranslocoModule,
    RouterModule,
    BetaFeatureModule,
  ],
  exports: [TabsHeaderComponent],
})
export class TabsHeaderModule {}
