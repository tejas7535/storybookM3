import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../info-icon/info-icon.module';
import { AttachmentFilesComponent } from './attachment-files.component';
@NgModule({
  declarations: [AttachmentFilesComponent],
  imports: [
    CommonModule,
    InfoIconModule,
    MatIconModule,
    MatDialogModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    PushPipe,
    LetDirective,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [AttachmentFilesComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class AttachmentFilesModule {}
