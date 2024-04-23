import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdDialogService } from '@mac/msd/services';
import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';
import { IndicatorComponent } from '@mac/shared/components/indicator/indicator.component';

import { ActionCellRendererComponent } from './action-cell-renderer/action-cell-renderer.component';
import { ActionHeaderComponent } from './action-header/action-header.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { DetailCellRendererComponent } from './detail-cell-renderer/detail-cell-renderer.component';
import { EditCellRendererComponent } from './edit-cell-renderer/edit-cell-renderer.component';
import { GreenSteelCellRendererComponent } from './green-steel-cell-renderer/green-steel-cell-renderer.component';
import { HeaderTooltipComponent } from './header-tooltip/header-tooltip.component';
import { LinkCellRendererComponent } from './link-cell-renderer/link-cell-renderer.component';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { MaterialEmissionClassificationComponent } from './material-emission-classification/material-emission-classification.component';
import { MaterialDialogsModule } from './material-input-dialog/materials/materials.module';
import { MaturityInfoComponent } from './maturity-info/maturity-info.component';
import { MoreInformationDialogComponent } from './more-information-dialog/more-information-dialog.component';
import { MsdNavigationModule } from './msd-navigation/msd-navigation.module';
import { PcfMaturityCo2CellRendererComponent } from './pcf-maturity-co2-cell-renderer/pcf-maturity-co2-cell-renderer.component';
import { QuickFilterModule } from './quick-filter/quick-filter.module';
import { RecentStatusCellRendererComponent } from './recent-status-cell-renderer/recent-status-cell-renderer.component';
import { ReleaseStatusCellRendererComponent } from './release-status-cell-renderer/release-status-cell-renderer.component';
import { UrlCellRendererComponent } from './url-cell-renderer/url-cell-renderer.component';

@NgModule({
  declarations: [
    MainTableComponent,
    EditCellRendererComponent,
    LinkCellRendererComponent,
    UrlCellRendererComponent,
    GreenSteelCellRendererComponent,
    PcfMaturityCo2CellRendererComponent,
    RecentStatusCellRendererComponent,
    ReleaseStatusCellRendererComponent,
    ActionCellRendererComponent,
    ActionHeaderComponent,
    DetailCellRendererComponent,
    HeaderTooltipComponent,
    MoreInformationDialogComponent,
    MaterialEmissionClassificationComponent,
  ],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    CustomSnackbarComponent,
    IndicatorComponent,
    HtmlTooltipComponent,
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
    MatDialogModule,
    MaterialDialogsModule,
    MsdNavigationModule,
    LetDirective,
    MatChipsModule,
    MatTooltipModule,
    OverlayModule,
    MaturityInfoComponent,
    QuickFilterModule,
  ],
  providers: [DatePipe, MsdDialogService],
})
export class MainTableModule {}
