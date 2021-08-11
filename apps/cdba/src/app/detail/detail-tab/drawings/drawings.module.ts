import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { UnderConstructionModule } from '@schaeffler/empty-states';

import { SharedModule } from '@cdba/shared';
import { LoadingSpinnerModule } from '@cdba/shared/components';

import { DrawingsTableModule } from './drawings-table/drawings-table.module';
import { DrawingsComponent } from './drawings.component';

@NgModule({
  declarations: [DrawingsComponent],
  imports: [
    SharedModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    DrawingsTableModule,
    LoadingSpinnerModule,
    UnderConstructionModule,
  ],
  exports: [DrawingsComponent],
})
export class DrawingsModule {}
