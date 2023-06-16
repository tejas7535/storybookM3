import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '@cdba/shared/components';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { DrawingsComponent } from './drawings.component';
import { DrawingsTableModule } from './drawings-table/drawings-table.module';

@NgModule({
  declarations: [DrawingsComponent],
  imports: [
    CommonModule,
    PushPipe,
    SharedTranslocoModule,
    MaterialNumberModule,
    DrawingsTableModule,
    LoadingSpinnerModule,
    UnderConstructionModule,
  ],
  exports: [DrawingsComponent],
})
export class DrawingsModule {}
