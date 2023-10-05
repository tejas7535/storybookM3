import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailViewHeaderContentComponent } from './detail-view-header-content.component';

@NgModule({
  declarations: [DetailViewHeaderContentComponent],
  imports: [CommonModule, MatChipsModule, SharedTranslocoModule],
  exports: [DetailViewHeaderContentComponent],
})
export class DetailViewHeaderContentModule {}
