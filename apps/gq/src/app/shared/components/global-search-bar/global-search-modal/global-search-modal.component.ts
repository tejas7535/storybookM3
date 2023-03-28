import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Params, Router } from '@angular/router';

import {
  debounce,
  EMPTY,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

import { AutoCompleteFacade } from '@gq/core/store/facades';
import { CaseFilterItem } from '@gq/core/store/reducers/models';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { FILTER_PARAM_INDICATOR } from '../../../constants';
import { QuotationSearchResult } from '../../../models/quotation';
import { IdValue } from '../../../models/search';
import { MaterialNumberService } from '../../../services/material-number/material-number.service';
import { QuotationService } from '../../../services/rest-services/quotation-service/quotation.service';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import {
  openInNewTabByUrl,
  openInNewWindowByUrl,
} from '../../contextMenu/functions/context-menu-functions';
import { GlobalSearchLastResultsService } from '../global-search-last-results-service/global-search-last-results.service';
import { OpenIn } from './models/open-in.enum';
import { ResultsListDisplay } from './models/results-list-display.enum';

@Component({
  selector: 'gq-global-search-modal',
  templateUrl: './global-search-modal.component.html',
})
export class GlobalSearchModalComponent implements OnInit, OnDestroy {
  private readonly DEBOUNCE_TIME_DEFAULT = 500;
  public readonly MIN_INPUT_STRING_LENGTH_FOR_AUTOCOMPLETE = 2;

  public displayResultList: ResultsListDisplay =
    ResultsListDisplay.LAST_RESULTS;
  public searchResult: QuotationSearchResult[] = [];

  public readonly resultsDisplayType = ResultsListDisplay;
  public readonly openIn = OpenIn;

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
    public readonly lastSearchResultsService: GlobalSearchLastResultsService,
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

            this.displayResultList = ResultsListDisplay.LAST_RESULTS;
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

        this.displayResultList = ResultsListDisplay.PREVIEW;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  selectTopItem(): void {
    switch (this.displayResultList) {
      case ResultsListDisplay.PREVIEW: {
        this.selectOnlySearchResult(
          this.autocomplete.materialNumberOrDescForGlobalSearch$.pipe(
            map((value: CaseFilterItem) => value.options)
          )
        );

        break;
      }
      case ResultsListDisplay.LAST_RESULTS: {
        this.selectOnlySearchResult(
          this.lastSearchResultsService.lastSearchResults$
        );

        break;
      }
      case ResultsListDisplay.RESULT: {
        if (this.searchResult.length === 1) {
          this.openCase(this.searchResult[0]);
        }

        break;
      }
      default:
        return;
    }
  }

  private selectOnlySearchResult(results: Observable<IdValue[]>): void {
    results.pipe(take(1)).subscribe((lastSearchResults: IdValue[]) => {
      if (lastSearchResults.length === 1) {
        this.onItemSelected(lastSearchResults[0]);
      }
    });
  }

  onItemSelected(idValue: IdValue) {
    if (this.displayResultList === ResultsListDisplay.PREVIEW) {
      this.lastSearchResultsService.addLastResult(idValue, this.searchVal);
    } else if (
      this.displayResultList === ResultsListDisplay.LAST_RESULTS &&
      idValue.value2
    ) {
      this.searchVal = idValue.value2;
    }

    this.displayResultList = ResultsListDisplay.LOADING;

    this.setFilter(idValue);

    this.quotationService
      .getCasesByMaterialNumber(idValue.value)
      .pipe(
        take(1),
        tap(() => {
          this.displayResultList = ResultsListDisplay.RESULT;
        })
      )
      .subscribe(
        (values: QuotationSearchResult[]) => (this.searchResult = values)
      );
  }

  openCase(gqCase: QuotationSearchResult, openIn?: OpenIn): void {
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

    const url = this.router.createUrlTree([AppRoutePath.ProcessCaseViewPath], {
      queryParamsHandling: 'merge',
      queryParams,
    });

    switch (openIn) {
      case OpenIn.window:
        openInNewWindowByUrl(`${window.location.origin}${url.toString()}`);
        break;
      case OpenIn.tab:
        openInNewTabByUrl(`${window.location.origin}${url.toString()}`);
        break;
      default:
        this.router.navigateByUrl(url);
        this.clearInputField();
        this.closeDialog();

        break;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  clearInputField() {
    this.searchFormControl.patchValue('');
    this.displayResultList = ResultsListDisplay.LAST_RESULTS;
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
