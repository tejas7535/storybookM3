import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FeatureToggleViewModule } from '@gq/feature-toggle-view/feature-toggle-view.module';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { ContextMenuModule } from '../contextMenu/context-menu.module';
import { NoDataModule } from '../no-data/no-data.module';
import { CasesResultTableComponent } from './cases-result-table/cases-result-table.component';
import { GlobalSearchAdvancedModalComponent } from './global-search-advanced-modal/global-search-advanced-modal.component';
import { GlobalSearchBarComponent } from './global-search-bar.component';
import { GlobalSearchModalComponent } from './global-search-modal/global-search-modal.component';
import { GlobalSearchResultsItemComponent } from './global-search-results-item/global-search-results-item.component';
import { GlobalSearchResultsListComponent } from './global-search-results-list/global-search-results-list.component';
import { GlobalSearchResultsPreviewFormatterPipe } from './global-search-results-preview-formatter/global-search-results-preview-formatter.pipe';
import { GlobalSearchResultsPreviewListComponent } from './global-search-results-preview-list/global-search-results-preview-list.component';
import { GlobalSearchResultsPreviewListEntryComponent } from './global-search-results-preview-list-entry/global-search-results-preview-list-entry.component';
import { MaterialsResultTableComponent } from './materials-result-table/materials-result-table.component';
@NgModule({
  declarations: [
    GlobalSearchBarComponent,
    GlobalSearchModalComponent,
    GlobalSearchResultsPreviewListComponent,
    GlobalSearchResultsPreviewListEntryComponent,
    GlobalSearchResultsPreviewFormatterPipe,
    GlobalSearchResultsListComponent,
    GlobalSearchResultsItemComponent,
    GlobalSearchAdvancedModalComponent,
    CasesResultTableComponent,
    MaterialsResultTableComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
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
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    NoDataModule,
    FeatureToggleViewModule,
  ],
  exports: [GlobalSearchBarComponent],
})
export class GlobalSearchBarModule {}
