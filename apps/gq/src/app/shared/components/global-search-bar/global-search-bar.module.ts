import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchBarComponent } from './global-search-bar.component';

@NgModule({
  declarations: [GlobalSearchBarComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SharedDirectivesModule,
    SharedTranslocoModule,
  ],
  exports: [GlobalSearchBarComponent],
})
export class GlobalSearchBarModule {}
