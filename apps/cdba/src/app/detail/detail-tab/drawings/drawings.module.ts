import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { UnderConstructionModule } from '@schaeffler/empty-states';

import { LoadingSpinnerModule } from '@cdba/shared/components';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { DrawingsTableModule } from './drawings-table/drawings-table.module';
import { DrawingsComponent } from './drawings.component';

@NgModule({
  declarations: [DrawingsComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    MaterialNumberModule,
    DrawingsTableModule,
    LoadingSpinnerModule,
    UnderConstructionModule,
  ],
  exports: [DrawingsComponent],
})
export class DrawingsModule {}
