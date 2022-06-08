import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,
  MatExpansionModule,
  MatExpansionPanelDefaultOptions,
} from '@angular/material/expansion';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AdditionalInformationWidgetModule } from '../additional-information-widget/additional-information-widget.module';
import { DimensionsWidgetModule } from '../dimensions-widget/dimensions-widget.module';
import { MaterialCardComponent } from './material-card.component';
import { MaterialCardStore } from './material-card.store';

const defaultOptions: MatExpansionPanelDefaultOptions = {
  expandedHeight: '56px',
  collapsedHeight: '56px',
  hideToggle: false,
};
@NgModule({
  declarations: [MaterialCardComponent],
  imports: [
    CommonModule,
    PushModule,
    MatCardModule,
    MatExpansionModule,
    SharedTranslocoModule,
    DimensionsWidgetModule,
    AdditionalInformationWidgetModule,
  ],
  providers: [
    { provide: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, useValue: defaultOptions },
    MaterialCardStore,
  ],
  exports: [MaterialCardComponent],
})
export class MaterialCardModule {}
