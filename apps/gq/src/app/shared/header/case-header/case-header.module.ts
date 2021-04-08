import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { CustomerHeaderModule } from '../customer-header/customer-header.module';
import { CaseHeaderComponent } from './case-header.component';

@NgModule({
  declarations: [CaseHeaderComponent],
  imports: [
    CustomerHeaderModule,
    IconsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    SharedModule,
    SharedTranslocoModule,
    SharedPipesModule,
  ],
  exports: [CaseHeaderComponent],
})
export class CaseHeaderModule {}
