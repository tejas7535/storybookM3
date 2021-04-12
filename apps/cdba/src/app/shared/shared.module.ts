import { CommonModule, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ReactiveComponentModule } from '@ngrx/component';

registerLocaleData(de, 'de-DE');

@NgModule({
  imports: [CommonModule, FlexLayoutModule, ReactiveComponentModule],
  exports: [CommonModule, FlexLayoutModule, ReactiveComponentModule],
})
export class SharedModule {}
