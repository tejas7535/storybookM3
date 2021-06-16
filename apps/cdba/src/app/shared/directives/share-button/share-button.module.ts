import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShareButtonDirective } from './share-button.directive';

@NgModule({
  declarations: [ShareButtonDirective],
  imports: [CommonModule],
  exports: [ShareButtonDirective],
})
export class ShareButtonModule {}
