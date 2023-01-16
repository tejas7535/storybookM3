import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../components/info-icon/info-icon.module';
import { SharedDirectivesModule } from '../../directives/shared-directives.module';
import { ExtendedColumnHeaderComponent } from './extended-column-header/extended-column-header.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    SharedTranslocoModule,
    InfoIconModule,
    SharedDirectivesModule,
    MatTooltipModule,
    PushModule,
  ],
  declarations: [ExtendedColumnHeaderComponent],
  exports: [ExtendedColumnHeaderComponent],
})
export class ColumnHeadersModule {}
