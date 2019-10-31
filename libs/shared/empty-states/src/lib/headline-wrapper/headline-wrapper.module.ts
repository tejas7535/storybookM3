import { NgModule } from '@angular/core';

import { TranslocoModule } from '@ngneat/transloco';

import { HeadlineWrapperComponent } from './headline-wrapper.component';

@NgModule({
  imports: [TranslocoModule],
  declarations: [HeadlineWrapperComponent],
  exports: [HeadlineWrapperComponent]
})
export class HeadlineWrapperModule {}
