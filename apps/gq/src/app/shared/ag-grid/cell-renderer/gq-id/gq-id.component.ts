import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Params, Router } from '@angular/router';

import { SearchbarGridContext } from '@gq/shared/components/global-search-bar/config/searchbar-grid-context.interface';
import { addMaterialFilterToQueryParams } from '@gq/shared/utils/misc.utils';

import { ViewQuotation } from '../../../models/quotation';
import { ColumnUtilityService } from '../../services';

@Component({
  selector: 'gq-gq-id',
  templateUrl: './gq-id.component.html',
  styles: [],
})
export class GqIdComponent {
  quotation: ViewQuotation;
  valueFormatted: string;
  urlQueryParams: NavigationExtras;
  url: string;

  constructor(
    private readonly router: Router,
    private readonly columnUtilityService: ColumnUtilityService,
    private readonly dialog: MatDialog
  ) {}

  agInit(params: any): void {
    const context = params.context as SearchbarGridContext;
    this.valueFormatted = params.valueFormatted;
    this.quotation = params.data;
    const { customerId, salesOrg } = this.quotation.customerIdentifiers;
    const queryParams: Params = {
      quotation_number: this.quotation.gqId,
      customer_number: customerId,
      sales_org: salesOrg,
    };

    addMaterialFilterToQueryParams(queryParams, context, params.node.data);

    this.urlQueryParams = {
      queryParamsHandling: 'merge',
      queryParams,
    };

    this.url = this.router
      .createUrlTree(
        this.columnUtilityService.determineCaseNavigationPath(
          this.quotation.status,
          this.quotation.enabledForApprovalWorkflow
        ),
        this.urlQueryParams
      )
      .toString();
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();

    this.router.navigate(
      this.columnUtilityService.determineCaseNavigationPath(
        this.quotation.status,
        this.quotation.enabledForApprovalWorkflow
      ),
      this.urlQueryParams
    );

    this.dialog.closeAll();
  }
}
