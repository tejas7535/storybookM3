import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { CustomLoadingOverlayComponent } from '../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomOverlayModule } from '../../shared/table/custom-overlay/custom-overlay.module';
import { BomTabRoutingModule } from './bom-tab-routing.module';
import { BomTabComponent } from './bom-tab.component';

@NgModule({
  declarations: [BomTabComponent],
  imports: [
    SharedModule,
    BomTabRoutingModule,
    MatCardModule,
    MatIconModule,
    IconsModule,
    MatButtonModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([CustomLoadingOverlayComponent]),
    CustomOverlayModule,
  ],
})
export class BomTabModule {}
