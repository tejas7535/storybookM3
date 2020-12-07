import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../shared.module';
import { LoadingSpinnerComponent } from './loading-spinner.component';

@NgModule({
  declarations: [LoadingSpinnerComponent],
  imports: [SharedModule, MatProgressSpinnerModule],
  exports: [LoadingSpinnerComponent],
})
export class LoadingSpinnerModule {}
