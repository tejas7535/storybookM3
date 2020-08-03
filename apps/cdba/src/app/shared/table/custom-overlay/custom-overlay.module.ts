import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingSpinnerModule } from '../../loading-spinner/loading-spinner.module';
import { CustomLoadingOverlayComponent } from './custom-loading-overlay/custom-loading-overlay.component';

@NgModule({
  declarations: [CustomLoadingOverlayComponent],
  imports: [CommonModule, LoadingSpinnerModule],
  exports: [CustomLoadingOverlayComponent],
})
export class CustomOverlayModule {}
