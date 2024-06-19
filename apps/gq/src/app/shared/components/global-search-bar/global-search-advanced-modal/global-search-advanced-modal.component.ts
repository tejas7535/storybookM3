import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import {
  BehaviorSubject,
  debounceTime,
  merge,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { QuotationSearchResultByCases } from '@gq/shared/models/quotation/quotation-search-result-by-cases.interface';
import { QuotationSearchResultByMaterials } from '@gq/shared/models/quotation/quotation-search-result-by-materials.interface';
import { QuotationSummaryService } from '@gq/shared/services/rest/quotation/quotation-summary/quotation-summary.service';
import { minLengthTrimmedValueValidator } from '@gq/shared/validators/min-length-trimmed-value.validator';

import { CasesCriteriaSelection } from '../cases-result-table/cases-criteria-selection.enum';
import { SEARCH_CRITERIA_VALIDATION_CONFIG } from '../config/default-config';
import { MaterialsCriteriaSelection } from '../materials-result-table/material-criteria-selection.enum';

@Component({
  selector: 'gq-global-search-advanced-modal',
  templateUrl: './global-search-advanced-modal.component.html',
})
export class GlobalSearchAdvancedModalComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(
    MatDialogRef<GlobalSearchAdvancedModalComponent>
  );

  private readonly quotationSummaryService = inject(QuotationSummaryService);

  private readonly loading$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  loading$ = this.loading$$.asObservable();
  onlyUserCases = false;
  activeMinLengthForValidation =
    SEARCH_CRITERIA_VALIDATION_CONFIG['default']?.minLength;
  trailingLeadingSpacesInfo: boolean;

  searchFormControl: FormControl = new FormControl('', [
    Validators.required,
    minLengthTrimmedValueValidator(this.activeMinLengthForValidation),
  ]);

  private readonly searchByCasesSubject$$: Subject<void> = new Subject<void>();
  private readonly searchByMaterialsSubject$$: Subject<void> =
    new Subject<void>();
  private readonly resetSubject$$: Subject<void> = new Subject<void>();
  reset$ = this.resetSubject$$.asObservable();
  tabIndex = 0;
  casesSearchCriteria: CasesCriteriaSelection;
  materialSearchCriteria: MaterialsCriteriaSelection;

  casesResults: QuotationSearchResultByCases[] = null;
  materialResults: QuotationSearchResultByMaterials[] = null;

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(2000))
      .subscribe(() => {
        // a minLength Error will be displayed with a debounce time of 2 seconds
        // the button will be disabled depending on errors immediately
        if (this.searchFormControl.hasError('minlength')) {
          this.searchFormControl.setErrors({ minlengthDisplay: true });
        }
      });

    this.searchByMaterialsSubject$$
      .pipe(
        switchMap(() => {
          this.loading$$.next(true);

          return this.quotationSummaryService
            .getSearchResultsByMaterials(
              this.onlyUserCases,
              this.materialSearchCriteria,
              this.searchFormControl.value
            )
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              takeUntil(merge(this.resetSubject$$, this.searchByCasesSubject$$))
            );
        })
      )
      .subscribe((results) => {
        this.materialResults = results;
        this.loading$$.next(false);
      });

    this.searchByCasesSubject$$
      .pipe(
        switchMap(() => {
          this.loading$$.next(true);

          return this.quotationSummaryService
            .getSearchResultsByCases(
              this.onlyUserCases,
              this.casesSearchCriteria,
              this.searchFormControl.value
            )
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              takeUntil(
                merge(this.resetSubject$$, this.searchByMaterialsSubject$$)
              )
            );
        })
      )
      .subscribe((results) => {
        this.casesResults = results;
        this.loading$$.next(false);
      });
  }

  clearDialog() {
    this.onlyUserCases = false;
    this.searchFormControl.patchValue('');
    this.casesResults = null;
    this.materialResults = null;
    this.loading$$.next(false);
    this.resetSubject$$.next();
  }

  search(): void {
    this.casesResults = null;
    this.materialResults = null;
    this.determineSearch();
  }

  toggleOnlyUserCases(): void {
    this.onlyUserCases = !this.onlyUserCases;
  }

  casesCriteriaSelected(criteria: CasesCriteriaSelection): void {
    this.casesSearchCriteria = criteria;
    if (this.tabIndex === 0) {
      this.updateValidators(this.casesSearchCriteria);
    }
  }

  materialCriteriaSelected(criteria: MaterialsCriteriaSelection): void {
    this.materialSearchCriteria = criteria;
    if (this.tabIndex === 1) {
      this.updateValidators(this.materialSearchCriteria);
    }
  }

  tabChanged(): void {
    this.updateValidators(
      this.tabIndex ? this.materialSearchCriteria : this.casesSearchCriteria
    );
  }

  closeDialog() {
    this.resetSubject$$.complete();
    this.searchByMaterialsSubject$$.complete();
    this.searchByCasesSubject$$.complete();
    this.dialogRef.close();
  }

  /**
   * perform either search by materials or cases
   */
  private determineSearch(): void {
    // tabIndex = 0 is a falsy value, so we can use it for determine which search to perform
    if (this.tabIndex) {
      this.searchByMaterialsSubject$$.next();
    } else {
      this.searchByCasesSubject$$.next();
    }
  }

  private updateValidators(
    criteriaSelected: CasesCriteriaSelection | MaterialsCriteriaSelection
  ): void {
    const minLength =
      SEARCH_CRITERIA_VALIDATION_CONFIG[criteriaSelected]?.minLength ??
      SEARCH_CRITERIA_VALIDATION_CONFIG['default']?.minLength;

    this.trailingLeadingSpacesInfo =
      SEARCH_CRITERIA_VALIDATION_CONFIG[
        criteriaSelected
      ]?.trailingLeadingSpacesInfo;

    if (this.activeMinLengthForValidation !== minLength) {
      this.searchFormControl.setValidators([
        Validators.required,
        minLengthTrimmedValueValidator(minLength),
      ]);
      this.searchFormControl.updateValueAndValidity();
      this.activeMinLengthForValidation = minLength;
    }
  }
}
