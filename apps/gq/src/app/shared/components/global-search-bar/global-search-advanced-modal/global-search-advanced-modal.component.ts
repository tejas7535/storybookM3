import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, take } from 'rxjs';

import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { QuotationSummaryService } from '@gq/shared/services/rest/quotation/quotation-summary/quotation-summary.service';

import { CasesCriteriaSelection } from '../cases-result-table/cases-criteria-selection.enum';

@Component({
  selector: 'gq-global-search-advanced-modal',
  templateUrl: './global-search-advanced-modal.component.html',
})
export class GlobalSearchAdvancedModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<GlobalSearchAdvancedModalComponent>
  );

  private readonly quotationSummaryService = inject(QuotationSummaryService);

  private readonly MIN_LENGTH = 3;
  private readonly loading$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loading$$.asObservable();
  onlyUserCases = false;
  searchFormControl: FormControl = new FormControl('', [
    Validators.minLength(this.MIN_LENGTH),
    Validators.required,
  ]);

  tabIndex = 0;
  casesSearchCriteria: CasesCriteriaSelection;
  materialSearchCriteria: string;

  casesResults: QuotationSearchResultByCases[] = null;
  // TODO: to be done
  materialResults: any[] = null;

  clearInputField() {
    this.onlyUserCases = false;
    this.searchFormControl.patchValue('');
  }

  search(): void {
    this.determineSearch();
  }

  toggleOnlyUserCases(): void {
    this.onlyUserCases = !this.onlyUserCases;
  }

  casesCriteriaSelected(criteria: CasesCriteriaSelection): void {
    this.casesSearchCriteria = criteria;
  }

  materialCriteriaSelected(criteria: string): void {
    this.materialSearchCriteria = criteria;
  }

  closeDialog() {
    this.dialogRef.close();
  }
  /**
   * perform either search by materials or cases
   */
  private determineSearch(): void {
    // tabIndex = 0 is a falsy value so we can use it for determine which search to perform
    if (this.tabIndex) {
      this.loading$$.next(true);
      console.log('no search by materials performed yet');
      this.loading$$.next(false);

      return;
    } else {
      this.loading$$.next(true);
      this.quotationSummaryService
        .getSearchResultsByCases(
          this.onlyUserCases,
          this.casesSearchCriteria,
          this.searchFormControl.value
        )
        .pipe(take(1))

        .subscribe((results) => {
          this.casesResults = results;
          this.loading$$.next(false);
        });
    }
  }
}
