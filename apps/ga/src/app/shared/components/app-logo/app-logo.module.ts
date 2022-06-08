import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppLogoComponent } from './app-logo.component';

@NgModule({
  declarations: [AppLogoComponent],
  imports: [CommonModule, SharedTranslocoModule],
  exports: [AppLogoComponent],
})
export class AppLogoModule {}
