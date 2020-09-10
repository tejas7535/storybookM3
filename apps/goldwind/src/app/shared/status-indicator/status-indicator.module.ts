import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { StatusIndicatorComponent } from './status-indicator.component';

@NgModule({
  declarations: [StatusIndicatorComponent],
  imports: [
    CommonModule,
    SharedModule,

    // UI Modules
    MatIconModule,

    // Translation
    SharedTranslocoModule,
  ],
  exports: [StatusIndicatorComponent],
})
export class StatusIndicatorModule {}
