import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subscription } from 'rxjs';

import { addMaterialRowDataItem, addRowDataItem } from '@gq/core/store/actions';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { Keyboard } from '../../../models';
import { MaterialTableItem } from '../../../models/table/material-table-item-model';
import { ValidationDescription } from '../../../models/table/validation-description.enum';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { PasteMaterialsService } from '../../../services/paste-materials-service/paste-materials.service';
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
  private readonly subscription: Subscription = new Subscription();

  @Input() public readonly isCaseView: boolean;

  @ViewChild('materialNumberInput')
  public matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  public matDescInput: AutocompleteInputComponent;

  constructor(
    private readonly store: Store,
    private readonly pasteMaterialsService: PasteMaterialsService,
    private readonly matSnackBar: MatSnackBar,
    public readonly autoCompleteFacade: AutoCompleteFacade
  ) {}

  public ngOnInit(): void {
    this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.ADD_ENTRY);
    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.quantityFormControl.setValidators([this.quantityValidator.bind(this)]);
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
    this.subscription.unsubscribe();
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
      this.quantity > 0;
  }

  addRow(): void {
    const items: MaterialTableItem[] = [
      {
        materialNumber: this.matNumberInput.searchFormControl.value,
        materialDescription: this.matDescInput.searchFormControl.value,
        quantity: this.quantity,
        info: { valid: true, description: [ValidationDescription.Valid] },
      },
    ];
    // dispatch action depending on page
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isCaseView
      ? this.store.dispatch(addRowDataItem({ items }))
      : this.store.dispatch(addMaterialRowDataItem({ items }));

    // clear fields after dispatching action
    this.matNumberInput.clearInput();
    this.matDescInput.clearInput();
    this.quantityFormControl.reset();
    this.materialInputIsValid = false;
  }

  onQuantityKeyPress(event: KeyboardEvent): void {
    if (event.key === Keyboard.ENTER && this.addRowEnabled) {
      this.addRow();

      return;
    }

    HelperService.validateQuantityInputKeyPress(event);
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
