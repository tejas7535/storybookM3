import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import {
  AdditionalInformationModule,
  BomTableModule,
} from '@cdba/shared/components';

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
    BomTableModule,
    AdditionalInformationModule,
    MatSidenavModule,
  ],
})
export class BomTabModule {}
