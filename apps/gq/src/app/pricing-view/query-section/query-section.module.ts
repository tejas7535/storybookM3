import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { QuerySectionComponent } from './query-section.component';

@NgModule({
  declarations: [QuerySectionComponent],
  imports: [CommonModule, MatChipsModule, MatIconModule],
  exports: [QuerySectionComponent],
})
export class QuerySectionModule {}
