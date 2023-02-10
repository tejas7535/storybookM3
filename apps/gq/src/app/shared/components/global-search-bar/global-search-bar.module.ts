import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { GlobalSearchBarComponent } from './global-search-bar.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';
import { GlobalSearchResultsPreviewFormatterPipe } from './global-search-results-preview-formatter/global-search-results-preview-formatter.pipe';
import { GlobalSearchResultsPreviewListComponent } from './global-search-results-preview-list/global-search-results-preview-list.component';
import { GlobalSearchResultsPreviewListEntryComponent } from './global-search-results-preview-list-entry/global-search-results-preview-list-entry.component';

@NgModule({
  declarations: [
    GlobalSearchBarComponent,
    GlobalSearchModalComponent,
    GlobalSearchResultsPreviewListComponent,
    GlobalSearchResultsPreviewListEntryComponent,
    GlobalSearchResultsPreviewFormatterPipe,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SharedDirectivesModule,
    SharedTranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    PushModule,
  ],
  exports: [GlobalSearchBarComponent],
})
export class GlobalSearchBarModule {}
