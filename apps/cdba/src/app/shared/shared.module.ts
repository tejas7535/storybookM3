import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveComponentModule } from '@ngrx/component';
import { MaterialNumberModule } from '@cdba/shared/pipes';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveComponentModule,
    MaterialNumberModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveComponentModule,
    MaterialNumberModule,
  ],
})
export class SharedModule {}
