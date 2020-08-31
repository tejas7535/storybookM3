import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';
import { AdditionalInformationComponent } from './additional-information.component';

@NgModule({
  declarations: [AdditionalInformationComponent],
  imports: [
    CommonModule,
    SharedModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatIconModule,
    UnderConstructionModule,
  ],
  exports: [AdditionalInformationComponent],
})
export class AdditionalInformationModule {}
