import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingSpinnerModule } from '../../loading-spinner/loading-spinner.module';
import { CustomLoadingOverlayComponent } from './custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from './custom-no-rows-overlay/custom-no-rows-overlay.component';

@NgModule({
  declarations: [CustomLoadingOverlayComponent, CustomNoRowsOverlayComponent],
  imports: [CommonModule, LoadingSpinnerModule],
  exports: [CustomLoadingOverlayComponent, CustomNoRowsOverlayComponent],
})
export class CustomOverlayModule {}
