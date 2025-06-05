import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationExtras, Params, Router } from '@angular/router';

import { CalculatorPaths } from '@gq/calculator/routing/calculator-paths.enum';
import { RfqRequest } from '@gq/calculator/service/models/get-rfq-requests-response.interface';

@Component({
  selector: 'gq-rfq-id',
  templateUrl: './rfq-id.component.html',
  styles: [],
  imports: [CommonModule],
})
export class RfqIdComponent {
  rfqRequest: RfqRequest;
  valueFormatted: string;
  urlQueryParams: NavigationExtras;
  url: string;

  private readonly router: Router = inject(Router);

  agInit(params: any): void {
    this.valueFormatted = params.valueFormatted;
    this.rfqRequest = params.data;

    const queryParams: Params = { rfqId: this.rfqRequest.rfqId };

    this.urlQueryParams = {
      queryParamsHandling: 'merge',
      queryParams,
    };

    this.url = this.router
      .createUrlTree(
        [`${CalculatorPaths.Rfq4DetailViewPath}`],
        this.urlQueryParams
      )
      .toString();
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();

    this.router.navigate(
      [`${CalculatorPaths.Rfq4DetailViewPath}`],
      this.urlQueryParams
    );
  }
}
