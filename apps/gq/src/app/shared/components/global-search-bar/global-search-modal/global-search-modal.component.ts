import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Params, Router } from '@angular/router';

import { debounce, EMPTY, Subject, take, takeUntil, tap, timer } from 'rxjs';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { AutoCompleteFacade } from '../../../../core/store';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { FILTER_PARAM_INDICATOR } from '../../../constants';
import { QuotationSearchResult } from '../../../models/quotation';
import { IdValue } from '../../../models/search';
import { MaterialNumberService } from '../../../services/material-number/material-number.service';
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
  public searchResult: QuotationSearchResult[] = [];

  private readonly unsubscribe$ = new Subject<boolean>();

  searchFormControl: FormControl;
  searchVal = '';
  private selectedMaterialNumber = '';
  private selectedMaterialDesc = '';

  constructor(
    private readonly dialogRef: MatDialogRef<GlobalSearchModalComponent>,
    private readonly quotationService: QuotationService,
    private readonly router: Router,
    private readonly materialNumberService: MaterialNumberService,
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

    this.setFilter(idValue);

    this.quotationService
      .getCasesByMaterialNumber(idValue.value)
      .pipe(
        take(1),
        tap(() => {
          this.displayResultList = 'result';
        })
      )
      .subscribe(
        (values: QuotationSearchResult[]) => (this.searchResult = values)
      );
  }

  openCase(gqCase: QuotationSearchResult): void {
    const queryParams: Params = {
      quotation_number: gqCase.gqId,
      customer_number: gqCase.customerId,
      sales_org: gqCase.customerSalesOrg,
    };

    if (this.selectedMaterialDesc) {
      queryParams[
        `${FILTER_PARAM_INDICATOR}${ColumnFields.MATERIAL_DESCRIPTION}`
      ] = this.selectedMaterialDesc;
    } else if (this.selectedMaterialNumber) {
      queryParams[
        `${FILTER_PARAM_INDICATOR}${ColumnFields.MATERIAL_NUMBER_15}`
      ] = this.selectedMaterialNumber;
    }

    this.clearInputField();
    this.closeDialog();

    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParamsHandling: 'merge',
      queryParams,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  clearInputField() {
    this.searchFormControl.patchValue('');
    this.displayResultList = 'preview';
  }

  /**
   * searching by mat number or mat description is a 'startWith' search
   * When number or description has been selected it is set as a filter for single case view
   * it can be description or number where description will be taken with priority
   *  Id --> description
   * value --> mat_number
   *
   * If number and description start with the same string description is taken
   * @param idValue the idValue pair of description and number
   * @returns
   */
  private setFilter(idValue: IdValue): void {
    if (idValue.id.startsWith(this.searchVal)) {
      this.selectedMaterialDesc = idValue.id;
      this.selectedMaterialNumber = '';
      this.searchFormControl.patchValue(this.selectedMaterialDesc, {
        emitEvent: false,
      });

      return;
    }

    if (
      this.materialNumberService.matNumberStartsWithSearchString(
        idValue.value,
        this.searchVal
      )
    ) {
      this.selectedMaterialNumber =
        this.materialNumberService.formatStringAsMaterialNumber(idValue.value);
      this.searchFormControl.patchValue(this.selectedMaterialNumber, {
        emitEvent: false,
      });
      this.selectedMaterialDesc = '';

      return;
    }
  }
}
