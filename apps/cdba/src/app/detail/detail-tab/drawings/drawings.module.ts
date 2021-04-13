import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedModule } from '@cdba/shared';

import { DrawingsTableModule } from './drawings-table/drawings-table.module';
import { DrawingsComponent } from './drawings.component';

@NgModule({
  declarations: [DrawingsComponent],
  imports: [SharedModule, ReactiveComponentModule, DrawingsTableModule],
  exports: [DrawingsComponent],
})
export class DrawingsModule {}
