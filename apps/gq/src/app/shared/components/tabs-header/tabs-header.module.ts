import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ContextMenuModule } from './../contextMenu/context-menu.module';
import { TabsHeaderComponent } from './tabs-header.component';

@NgModule({
  declarations: [TabsHeaderComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    SharedTranslocoModule,
    RouterModule,
    MatMenuModule,
    ContextMenuModule,
  ],
  exports: [TabsHeaderComponent],
})
export class TabsHeaderModule {}
