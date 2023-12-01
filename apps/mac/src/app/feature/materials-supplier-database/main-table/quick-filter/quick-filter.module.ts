import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { QuickFilterComponent } from './quick-filter.component';
import { QuickFilterManagementComponent } from './quick-filter-management/quick-filter-management.component';
import { QuickFiltersListComponent } from './quick-filter-management/quick-filters-list/quick-filters-list.component';
import { QuickfilterDialogComponent } from './quickfilter-dialog/quickfilter-dialog.component';

@NgModule({
  declarations: [
    QuickFilterComponent,
    QuickfilterDialogComponent,
    QuickFilterManagementComponent,
    QuickFiltersListComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonToggleModule,
    PushPipe,
    LetDirective,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedTranslocoModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
    MatTooltipModule,
  ],
  exports: [QuickFilterComponent, QuickFilterManagementComponent],
})
export class QuickFilterModule {}
