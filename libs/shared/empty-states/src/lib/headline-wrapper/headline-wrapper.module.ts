import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/shared/transloco';

import { HeadlineWrapperComponent } from './headline-wrapper.component';

@NgModule({
  imports: [SharedTranslocoModule],
  declarations: [HeadlineWrapperComponent],
  exports: [HeadlineWrapperComponent]
})
export class HeadlineWrapperModule {}
