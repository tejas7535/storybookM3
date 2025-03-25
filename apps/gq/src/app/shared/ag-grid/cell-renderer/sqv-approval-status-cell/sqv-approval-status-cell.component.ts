import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TagType } from '@gq/shared/models';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-sqv-approval-status-cell',
  templateUrl: './sqv-approval-status-cell.component.html',
  standalone: true,
  imports: [CommonModule, TagComponent, MatIconModule, SharedTranslocoModule],
})
export class SqvApprovalStatusCellComponent {
  protected tagType: TagType = TagType.NEUTRAL;
  protected sqvApprovalStatus: SqvApprovalStatus;

  agInit(params: ICellRendererParams): void {
    this.sqvApprovalStatus = params.value;
  }
}
