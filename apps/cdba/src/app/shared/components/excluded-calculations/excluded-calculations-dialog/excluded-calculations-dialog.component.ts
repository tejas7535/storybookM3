import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { CostRoles } from '@cdba/core/auth/auth.config';
import * as urls from '@cdba/shared/constants/urls';
import { ExcludedCalculations } from '@cdba/shared/models';

@Component({
  selector: 'cdba-excluded-calculations-dialog',
  templateUrl: './excluded-calculations-dialog.component.html',
})
export class ExcludedCalculationsDialogComponent {
  public urlRoleAssignments = urls.URL_ROLE_ASSIGNMENTS;
  public urlSams = urls.URL_SAMS;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public excludedCalculations: ExcludedCalculations = undefined
  ) {}

  public readonly formatMissingCostRoles = (
    costRoles: [`${CostRoles}`]
  ): string =>
    costRoles.map((costRole) => this.formatCostRole(costRole)).join(', ');

  private readonly formatCostRole = (costRole: `${CostRoles}`): string => {
    switch (costRole) {
      case 'CDBA_COST_TYPE_SQV':
        return '<SD-INFORMATION_SAW>';
      case 'CDBA_COST_TYPE_GPC':
        return '<CO_PC-INFORMATION>';
      default:
        return costRole;
    }
  };
}
