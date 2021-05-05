import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { BackButtonDirective } from './back-button.directive';

@NgModule({
  declarations: [BackButtonDirective],
  imports: [SharedModule],
  exports: [BackButtonDirective],
})
export class BackButtonModule {}
