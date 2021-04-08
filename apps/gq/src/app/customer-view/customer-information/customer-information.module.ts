import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { CustomerInformationComponent } from './customer-information.component';

@NgModule({
  declarations: [CustomerInformationComponent],
  imports: [
    CommonModule,
    MatCardModule,
    SharedTranslocoModule,
    SharedPipesModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'customer-view',
    },
  ],
  exports: [CustomerInformationComponent],
})
export class CustomerInformationModule {}
