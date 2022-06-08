import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '../../horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../label-text/label-text.module';
import { StatusBarModalComponent } from './status-bar-modal.component';

@NgModule({
  declarations: [StatusBarModalComponent],
  imports: [
    CommonModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    HorizontalDividerModule,
    LabelTextModule,
    PushModule,
    SharedPipesModule,
  ],
  exports: [StatusBarModalComponent],
})
export class StatusBarModalModule {}
