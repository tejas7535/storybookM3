import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared.module';
import { BlockUiComponent } from './block-ui.component';

@NgModule({
  declarations: [BlockUiComponent],
  imports: [SharedModule, SharedTranslocoModule, MatProgressBarModule],
  exports: [BlockUiComponent],
})
export class BlockUiModule {}
