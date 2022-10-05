import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TabsHeaderComponent } from './tabs-header.component';

@NgModule({
  declarations: [TabsHeaderComponent],
  imports: [CommonModule, MatTabsModule, SharedTranslocoModule, RouterModule],
  exports: [TabsHeaderComponent],
})
export class TabsHeaderModule {}
