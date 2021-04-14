import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { TabsHeaderComponent } from './tabs-header.component';

@NgModule({
  declarations: [TabsHeaderComponent],
  imports: [
    SharedModule,
    MatIconModule,
    MatTabsModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    RouterModule,
  ],
  exports: [TabsHeaderComponent],
})
export class TabsHeaderModule {}
