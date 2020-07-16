import { CommonModule, registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

registerLocaleData(de, 'de-DE');

@NgModule({
  imports: [CommonModule, FlexLayoutModule],
  exports: [CommonModule, FlexLayoutModule],
})
export class SharedModule {}
