import { NgModule } from '@angular/core';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BlockUiComponent } from './block-ui.component';

@NgModule({
  declarations: [BlockUiComponent],
  imports: [SharedTranslocoModule, MatProgressBarModule],
  exports: [BlockUiComponent],
})
export class BlockUiModule {}
