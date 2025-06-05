import { Component } from '@angular/core';

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { TagType } from '@gq/shared/models/tag-type.enum';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-rfq-4-calculator-status-cell',
  templateUrl: './../../rfq-4-status-cell/rfq-4-status-cell.component.html',
  standalone: true,
  imports: [TagComponent, SharedTranslocoModule],
})
export class Rfq4CalculatorStatusCellComponent {
  protected tagType: TagType;
  protected rfq4Status: Rfq4Status;

  agInit(params: ICellRendererParams): void {
    this.rfq4Status = params.value;
    this.tagType = this.getTagTypeByStatus(this.rfq4Status);
  }

  private getTagTypeByStatus(status: Rfq4Status): TagType {
    switch (status) {
      case Rfq4Status.OPEN: {
        return TagType.INFO;
      }
      case Rfq4Status.REOPEN: {
        return TagType.WARNING;
      }
      default: {
        return TagType.NEUTRAL;
      }
    }
  }
}
