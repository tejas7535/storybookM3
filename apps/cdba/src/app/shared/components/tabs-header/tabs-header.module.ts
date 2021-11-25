import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { TabsHeaderComponent } from './tabs-header.component';

@NgModule({
  declarations: [TabsHeaderComponent],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    SharedTranslocoModule,
    RouterModule,
  ],
  exports: [TabsHeaderComponent],
})
export class TabsHeaderModule {}
