import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { LoadingSpinnerComponent } from './loading-spinner.component';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
  declarations: [LoadingSpinnerComponent],
  exports: [LoadingSpinnerComponent],
})
export class LoadingSpinnerModule {}
