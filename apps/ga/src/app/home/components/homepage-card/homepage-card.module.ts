import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HomepageCardComponent } from './homepage-card.component';

@NgModule({
  declarations: [HomepageCardComponent],
  imports: [CommonModule, SharedTranslocoModule],
  exports: [HomepageCardComponent],
})
export class HomepageCardModule {}
