import { Component } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ia-amount-cell-renderer',
  templateUrl: './amount-cell-renderer.component.html',
})
export class AmountCellRendererComponent implements ICellRendererAngularComp {
  amount: number;
  restrictedAccess: boolean;
  tooltip = '';

  constructor(private readonly translocoService: TranslocoService) {}

  agInit(params: ICellRendererParams): void {
    this.amount = params.value.count;
    this.restrictedAccess = params.value.restrictedAccess;
    this.setTooltip();
  }

  setTooltip(): void {
    this.tooltip = !this.restrictedAccess
      ? this.translocoService.translate('accessRights.showTeamMembers')
      : this.translocoService.translate(
          'accessRights.showTeamMembersPartially'
        );
  }

  refresh(): boolean {
    return false;
  }
}
