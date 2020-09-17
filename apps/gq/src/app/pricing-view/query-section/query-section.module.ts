import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { QuerySectionComponent } from './query-section.component';

@NgModule({
  declarations: [QuerySectionComponent],
  imports: [CommonModule, MatChipsModule, MatIconModule, SharedTranslocoModule],
  exports: [QuerySectionComponent],
})
export class QuerySectionModule {}
