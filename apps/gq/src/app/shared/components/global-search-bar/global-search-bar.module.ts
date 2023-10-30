import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { ContextMenuModule } from '../contextMenu/context-menu.module';
import { GlobalSearchBarComponent } from './global-search-bar.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';
import { GlobalSearchResultsItemComponent } from './global-search-results-item/global-search-results-item.component';
import { GlobalSearchResultsListComponent } from './global-search-results-list/global-search-results-list.component';
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
    GlobalSearchResultsListComponent,
    GlobalSearchResultsItemComponent,
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
    PushPipe,
    MatTooltipModule,
    MatButtonModule,
    SharedPipesModule,
    ContextMenuModule,
    MatMenuModule,
  ],
  exports: [GlobalSearchBarComponent],
})
export class GlobalSearchBarModule {}
