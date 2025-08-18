import { CommonModule } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TRANSLOCO_DATE_PIPE_CONFIG } from '@gq/shared/constants/transloco-date-pipe-config';
import { Attachment } from '@gq/shared/services/rest/attachments/models/attachment.interface';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-attachments',
  templateUrl: './attachments.component.html',
  imports: [
    CommonModule,
    MatTooltipModule,
    SharedTranslocoModule,
    MatIconModule,
    TranslocoDatePipe,
  ],
})
export class AttachmentsComponent<T extends Attachment> {
  attachments = input<T[]>([]);
  deleteButtonEnabled = input<boolean>(true);
  deleteButtonDisabledTooltipText = input<string>('');

  // optional input Template
  additionContentTemplate = input<TemplateRef<any>>();

  deleteClicked = output<T>();
  downloadClicked = output<T>();

  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;
}
