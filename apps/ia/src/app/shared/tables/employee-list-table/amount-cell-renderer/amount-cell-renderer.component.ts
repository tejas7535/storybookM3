import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@jsverse/transloco';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  selector: 'ia-amount-cell-renderer',
  templateUrl: './amount-cell-renderer.component.html',
  styles: `
    ::ng-deep .ia-ag-header-align-right .ag-header-cell-label,
    .ag-cell-value ia-amount-cell-renderer .flex {
      justify-content: flex-end;
    }
  `,
})
export class AmountCellRendererComponent implements ICellRendererAngularComp {
  amount: number;
  restrictedAccess: boolean;
  tooltip = '';

  constructor(private readonly translocoService: TranslocoService) {}

  agInit(params: ICellRendererParams): void {
    this.amount = params.value?.count;
    this.restrictedAccess = params.value?.restrictedAccess;
    this.setTooltip();
  }

  setTooltip(): void {
    this.tooltip = this.restrictedAccess
      ? this.translocoService.translate('accessRights.showTeamMembersPartially')
      : this.translocoService.translate('accessRights.showTeamMembers');
  }

  refresh(): boolean {
    return false;
  }
}
