import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable } from 'rxjs';

import { addRowDataItems } from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseActions } from '@gq/core/store/process-case';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import {
  parseNullableLocalizedInputValue,
  validateQuantityInputKeyPress,
} from '@gq/shared/utils/misc.utils';
import { translate } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { Store } from '@ngrx/store';

import { Keyboard } from '../../../models';
import { MaterialTableItem } from '../../../models/table/material-table-item-model';
import { ValidationDescription } from '../../../models/table/validation-description.enum';
import { PasteMaterialsService } from '../../../services/paste-materials/paste-materials.service';
import { priceValidator } from '../../../validators/price-validator';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
@Component({
  selector: 'gq-add-entry',
  templateUrl: './add-entry.component.html',
})
export class AddEntryComponent implements OnInit, OnDestroy {
  public materialNumber$: Observable<CaseFilterItem>;
  public materialDesc$: Observable<CaseFilterItem>;
  autoSelectMaterial$: Observable<CaseFilterItem>;
  public materialNumberAutocompleteLoading$: Observable<boolean>;
  public materialDescAutocompleteLoading$: Observable<boolean>;

  public materialNumberInput: boolean;
  public quantity: number;
  public materialInputIsValid = false;
  public quantityValid = false;
  public addRowEnabled = false;
  public quantityFormControl: UntypedFormControl = new UntypedFormControl();
  public targetPriceFormControl: FormControl = new FormControl();

  @Input() public readonly isCaseView: boolean;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;

  constructor(
    public readonly autoCompleteFacade: AutoCompleteFacade,
    private readonly store: Store,
    private readonly pasteMaterialsService: PasteMaterialsService,
    private readonly matSnackBar: MatSnackBar,
    private readonly translocoLocaleService: TranslocoLocaleService
  ) {}

  public ngOnInit(): void {
    this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.ADD_ENTRY);
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.quantityFormControl.setValidators([this.quantityValidator.bind(this)]);
    this.targetPriceFormControl.setValidators([
      priceValidator(this.translocoLocaleService.getLocale()).bind(this),
    ]);
    this.targetPriceFormControl.markAllAsTouched();
  }

  quantityValidator(control: AbstractControl): ValidationErrors {
    const { value } = control;
    // input field should stay green when empty
    this.quantityValid = !value || value > 0;
    this.quantity = value;
    this.rowInputValid();

    return !this.quantityValid
      ? { invalidInput: !this.quantityValid }
      : undefined;
  }

  ngOnDestroy(): void {
    this.autoCompleteFacade.resetView();
  }

  materialInputValid(isValid: boolean): void {
    this.materialInputIsValid = isValid;
    this.rowInputValid();
  }

  materialHasInput(hasInput: boolean): void {
    this.materialNumberInput = hasInput;
    this.rowInputValid();
  }

  rowInputValid(): void {
    this.addRowEnabled =
      this.materialInputIsValid &&
      this.materialNumberInput &&
      this.quantityValid &&
      this.quantity > 0 &&
      this.targetPriceFormControl.valid;
  }

  addRow(): void {
    const items: MaterialTableItem[] = [
      {
        materialNumber: this.matNumberInput.searchFormControl.value,
        materialDescription: this.matDescInput.searchFormControl.value,
        quantity: this.quantity,
        targetPrice:
          parseNullableLocalizedInputValue(
            this.targetPriceFormControl.value?.toString(),
            this.translocoLocaleService.getLocale()
          ) ?? undefined,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];
    // dispatch action depending on page
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isCaseView
      ? this.store.dispatch(addRowDataItems({ items }))
      : this.store.dispatch(
          ProcessCaseActions.addNewItemsToMaterialTable({ items })
        );

    // clear fields after dispatching action
    this.matNumberInput.clearInput();
    this.matDescInput.clearInput();
    this.quantityFormControl.reset();
    this.targetPriceFormControl.reset();
    this.materialInputIsValid = false;
  }

  onQuantityKeyPress(event: KeyboardEvent): void {
    if (event.key === Keyboard.ENTER && this.addRowEnabled) {
      this.addRow();

      return;
    }

    validateQuantityInputKeyPress(event);
  }

  pasteFromClipboard() {
    this.pasteMaterialsService.onPasteStart(this.isCaseView);
  }

  displaySnackBar(): void {
    const matSnackBarRef = this.matSnackBar.open(
      translate('shared.caseMaterial.addEntry.pasteSnackbar.message'),
      translate('shared.caseMaterial.addEntry.pasteSnackbar.action'),
      { duration: 5000 }
    );
    matSnackBarRef?.onAction().subscribe(() => {
      window
        .open(
          'https://worksite-my.sharepoint.com/:v:/g/personal/schmjan_schaeffler_com/Efn1Vc3JU9lNtI-PZoyVM1UBgUmnnXN1AsCir5lnqvT_fQ?e=rUsbeU',
          '_blank'
        )
        .focus();
    });
  }
}
