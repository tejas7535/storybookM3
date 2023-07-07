import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdDialogService } from '@mac/msd/services';
import { IndicatorComponent } from '@mac/shared/components/indicator/indicator.component';

import { ActionCellRendererComponent } from './action-cell-renderer/action-cell-renderer.component';
import { ActionHeaderComponent } from './action-header/action-header.component';
import { DetailCellRendererComponent } from './detail-cell-renderer/detail-cell-renderer.component';
import { EditCellRendererComponent } from './edit-cell-renderer/edit-cell-renderer.component';
import { GreenSteelCellRendererComponent } from './green-steel-cell-renderer/green-steel-cell-renderer.component';
import { HeaderTooltipComponent } from './header-tooltip/header-tooltip.component';
import { LinkCellRendererComponent } from './link-cell-renderer/link-cell-renderer.component';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { MaterialDialogsModule } from './material-input-dialog/materials/materials.module';
import { MsdNavigationModule } from './msd-navigation/msd-navigation.module';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { RecentStatusCellRendererComponent } from './recent-status-cell-renderer/recent-status-cell-renderer.component';
import { ReleaseStatusCellRendererComponent } from './release-status-cell-renderer/release-status-cell-renderer.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';
import { MoreInformationDialogComponent } from './more-information-dialog/more-information-dialog.component';

@NgModule({
  declarations: [
    MainTableComponent,
    EditCellRendererComponent,
    LinkCellRendererComponent,
    GreenSteelCellRendererComponent,
    RecentStatusCellRendererComponent,
    ReleaseStatusCellRendererComponent,
    ActionCellRendererComponent,
    ActionHeaderComponent,
    DetailCellRendererComponent,
    HeaderTooltipComponent,
    MoreInformationDialogComponent,
  ],
  imports: [
    IndicatorComponent,
    HtmlTooltipComponent,
    CommonModule,
    MainTableRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    PushPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    SharedTranslocoModule,
    QuickFilterComponent,
    MatDialogModule,
    MaterialDialogsModule,
    MsdNavigationModule,
    LetDirective,
    MatChipsModule,
    MatTooltipModule,
    OverlayModule,
  ],
  providers: [DatePipe, MsdDialogService],
})
export class MainTableModule {}
