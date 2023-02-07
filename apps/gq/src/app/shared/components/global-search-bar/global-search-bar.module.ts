import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchBarComponent } from './global-search-bar.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';
import { GlobalSearchResultsPreviewListComponent } from './global-search-results-preview-list/global-search-results-preview-list.component';
import { GlobalSearchResultsPreviewListEntryComponent } from './global-search-results-preview-list-entry/global-search-results-preview-list-entry.component';

@NgModule({
  declarations: [
    GlobalSearchBarComponent,
    GlobalSearchModalComponent,
    GlobalSearchResultsPreviewListComponent,
    GlobalSearchResultsPreviewListEntryComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    SharedDirectivesModule,
    SharedTranslocoModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [GlobalSearchBarComponent],
})
export class GlobalSearchBarModule {}
