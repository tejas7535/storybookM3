import { CommonModule, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveComponentModule } from '@ngrx/component';
import { MaterialNumberModule } from '@cdba/shared/pipes';

registerLocaleData(de, 'de-DE');

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
