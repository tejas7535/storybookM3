import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AdvancedBearingButtonComponent } from './advanced-bearing-button.component';

@NgModule({
  declarations: [AdvancedBearingButtonComponent],
  imports: [
    CommonModule,

    // Transloco
    SharedTranslocoModule,

    // Material Components
    MatButtonModule,
  ],
  bootstrap: [AdvancedBearingButtonComponent],
  exports: [AdvancedBearingButtonComponent],
})
export class AdvancedBearingButtonModule {}
