import { Component } from '@angular/core';

import { SqvCheckStatus } from '@gq/shared/models/quotation-detail/cost';
import { TagType } from '@gq/shared/models/tag-type.enum';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-sqv-check-status-cell',
  templateUrl: './sqv-check-status-cell.component.html',
  standalone: true,
  imports: [TagComponent, SharedTranslocoModule],
})
export class SqvCheckStatusCellComponent {
  protected tagType: TagType;
  protected sqvCheckStatus: SqvCheckStatus;

  agInit(params: ICellRendererParams): void {
    this.sqvCheckStatus = params.value;
    this.tagType = this.getTagTypeByStatus(this.sqvCheckStatus);
  }

  private getTagTypeByStatus(status: SqvCheckStatus): TagType {
    switch (status) {
      case SqvCheckStatus.OPEN: {
        return TagType.NEUTRAL;
      }
      case SqvCheckStatus.CANCELLED: {
        return TagType.ERROR;
      }
      case SqvCheckStatus.CONFIRMED: {
        return TagType.SUCCESS;
      }
      case SqvCheckStatus.IN_PROGRESS: {
        return TagType.WARNING;
      }
      default: {
        return TagType.NEUTRAL;
      }
    }
  }
}
