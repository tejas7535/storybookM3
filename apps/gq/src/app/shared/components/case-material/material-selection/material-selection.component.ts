import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { filter, Observable, tap } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { SalesIndication } from '@gq/core/store/reducers/models';
import { CustomerId } from '@gq/shared/models';
import { PLsSeriesRequest } from '@gq/shared/services/rest/search/models/pls-series-request.model';
import { provideTranslocoScope } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Selection } from './models/selection.model';

@Component({
  selector: 'gq-material-selection',
  templateUrl: './material-selection.component.html',
  imports: [
    MatCheckboxModule,
    MatSelectModule,
    SharedTranslocoModule,
    LetDirective,
    PushPipe,
  ],
  providers: [provideTranslocoScope('material-selection')],
})
export class MaterialSelectionComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly DEFAULT_SELECTED_YEARS = 2;
  private readonly createCaseFacade: CreateCaseFacade =
    inject(CreateCaseFacade);

  defaultSelection: Selection[] = [
    {
      id: 1,
      checked: true,
      translation: 'salesHistory',
      value: SalesIndication.INVOICE,
    },
    {
      id: 2,
      checked: false,
      translation: 'ordersOnHand',
      value: SalesIndication.ORDER,
    },
    {
      id: 3,
      checked: false,
      translation: 'lostQuotes',
      value: SalesIndication.LOST_QUOTE,
    },
    {
      id: 4,
      checked: false,
      translation: 'openQuotes',
      value: true,
    },
  ];
  allComplete = false;
  someComplete = true;
  selectionItems: Selection[] = this.createDefaultSelectionCopy();
  numberOfYears = this.DEFAULT_SELECTED_YEARS;
  // Max available years for historical data is 5 years https://jira.schaeffler.com/browse/GQUOTE-5797
  // To keep current logic - first year should be 0
  availableYears: number[] = [0, 1, 2, 3, 4];

  customerIdentifier: CustomerId;
  customerIdentifier$: Observable<CustomerId> =
    this.createCaseFacade.customerIdentifier$.pipe(
      takeUntilDestroyed(this.destroyRef),

      filter(
        (customerIdentifier) =>
          !!customerIdentifier.customerId && !!customerIdentifier.salesOrg
      ),
      tap((customerIdentifier: CustomerId) => {
        this.customerIdentifier = customerIdentifier;
        this.triggerPLsAndSeriesRequest();
      })
    );

  createDefaultSelectionCopy(): Selection[] {
    return JSON.parse(JSON.stringify(this.defaultSelection));
  }
  updateSelection(event: MatCheckboxChange, id: number): void {
    this.selectionItems.find((item) => item.id === id).checked = event.checked;
    const checkedItems = this.selectionItems.filter((item) => item.checked);

    this.allComplete = checkedItems.length === this.selectionItems.length;
    this.someComplete = checkedItems.length > 0 && !this.allComplete;
    this.triggerPLsAndSeriesRequest();
  }

  selectAll(event: MatCheckboxChange): void {
    this.selectionItems.forEach((item) => (item.checked = event.checked));
    this.triggerPLsAndSeriesRequest();
  }

  onHistoricalDataLimitChanged(event: MatSelectChange): void {
    this.numberOfYears = event.value;
    this.triggerPLsAndSeriesRequest();
  }

  resetAll(): void {
    this.selectionItems = this.createDefaultSelectionCopy();
    this.allComplete = false;
    this.someComplete = true;
    this.numberOfYears = this.DEFAULT_SELECTED_YEARS;
    this.triggerPLsAndSeriesRequest();
  }

  triggerPLsAndSeriesRequest(): void {
    if (this.customerIdentifier && this.selectionItems.length > 0) {
      const includeQuotationHistory = this.selectionItems.find(
        (item) => typeof item.value === 'boolean'
      ).checked;

      const salesIndications = this.selectionItems
        .filter((item) => typeof item.value != 'boolean' && item.checked)
        .map((item) => item.value) as SalesIndication[];

      const customerFilters: PLsSeriesRequest = {
        includeQuotationHistory,
        salesIndications,
        customer: this.customerIdentifier,
        historicalDataLimitInYear: this.numberOfYears,
      };
      this.createCaseFacade.getPLsAndSeries(customerFilters);
    }
  }
}
