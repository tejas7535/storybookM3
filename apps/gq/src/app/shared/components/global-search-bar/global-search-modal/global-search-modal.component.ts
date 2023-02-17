import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {
  debounce,
  EMPTY,
  NEVER,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { AutoCompleteFacade } from '../../../../core/store';
import { QuotationSearchResult } from '../../../models/quotation';
import { IdValue } from '../../../models/search';
import { QuotationService } from '../../../services/rest-services/quotation-service/quotation.service';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';

type ResultsList = 'preview' | 'result' | 'loading';
@Component({
  selector: 'gq-global-search-modal',
  templateUrl: './global-search-modal.component.html',
})
export class GlobalSearchModalComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  public readonly MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE = 2;

  public displayResultList: ResultsList = 'preview';
  public searchResult$: Observable<QuotationSearchResult[]> = NEVER;

  private readonly unsubscribe$ = new Subject<boolean>();

  searchFormControl: FormControl;

  searchVal = '';

  constructor(
    private readonly dialogRef: MatDialogRef<GlobalSearchModalComponent>,
    private readonly quotationService: QuotationService,
    private readonly router: Router,
    private readonly cdref: ChangeDetectorRef,
    public readonly autocomplete: AutoCompleteFacade
  ) {
    this.searchFormControl = new FormControl();
  }

  ngOnInit(): void {
    this.autocomplete.resetView();
    this.autocomplete.initFacade(AutocompleteRequestDialog.GLOBAL_SEARCH);

    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((value: string) => {
          if (value.length < this.MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE) {
            this.searchVal = value;
            this.autocomplete.resetAutocompleteMaterials();
          }
        }),
        debounce((value: string) =>
          value.length >= this.MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE
            ? timer(this.DEBOUNCE_TIME_DEFAULT)
            : EMPTY
        )
      )
      .subscribe((searchVal: string) => {
        this.searchVal = searchVal;

        if (searchVal === '') {
          this.autocomplete.resetAutocompleteMaterials();

          return;
        }

        this.autocomplete.autocomplete({
          filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
          searchFor: searchVal,
          limit: 5,
        });

        this.displayResultList = 'preview';
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  onItemSelected(idValue: IdValue) {
    this.displayResultList = 'loading';

    this.searchResult$ = this.quotationService
      .getCasesByMaterialNumber(idValue.value)
      .pipe(
        take(1),
        tap(() => {
          this.displayResultList = 'result';
          this.cdref.detectChanges();
        })
      );
  }

  openCase(gqCase: QuotationSearchResult): void {
    this.clearInputField();
    this.closeDialog();

    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        quotation_number: gqCase.gqId,
        customer_number: gqCase.customerNumber,
        sales_org: gqCase.salesOrg,
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  clearInputField() {
    this.searchFormControl.patchValue('');
    this.displayResultList = 'preview';
  }
}
