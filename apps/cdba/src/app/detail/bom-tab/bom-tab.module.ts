import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { AdditionalInformationModule } from './additional-information/additional-information.module';
import { BomTabRoutingModule } from './bom-tab-routing.module';
import { BomTabComponent } from './bom-tab.component';
import { BomTableModule } from './bom-table/bom-table.module';

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
    BomTableModule,
    AdditionalInformationModule,
    MatSidenavModule,
  ],
})
export class BomTabModule {}
