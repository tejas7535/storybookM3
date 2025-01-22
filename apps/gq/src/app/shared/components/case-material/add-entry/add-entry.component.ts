/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { combineLatest, filter, iif, map, Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseFacade } from '@gq/core/store/process-case';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import {
  getNextHigherPossibleMultiple,
  getTargetPriceSourceValue,
  getTargetPriceValue,
  parseNullableLocalizedInputValue,
  validateQuantityInputKeyPress,
} from '@gq/shared/utils/misc.utils';
import { quantityDeliveryUnitValidator } from '@gq/shared/validators/quantity-delivery-unit-validator';
import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Customer, CustomerId, Keyboard } from '../../../models';
import { MaterialTableItem } from '../../../models/table/material-table-item-model';
import { ValidationDescription } from '../../../models/table/validation-description.enum';
import { PasteMaterialsService } from '../../../services/paste-materials/paste-materials.service';
import { priceValidator } from '../../../validators/price-validator';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { InfoIconModule } from '../../info-icon/info-icon.module';
import { TargetPriceSourceSelectComponent } from '../../target-price-source-select/target-price-source-select.component';
@Component({
  selector: 'gq-add-entry',
  templateUrl: './add-entry.component.html',
  standalone: true,
  imports: [
    AutocompleteInputComponent,
    TargetPriceSourceSelectComponent,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    ReactiveFormsModule,
    PushPipe,
    InfoIconModule,
    CommonModule,
    LetDirective,
    MatSelectModule,
    SharedPipesModule,
  ],
})
export class AddEntryComponent implements OnInit, OnDestroy {
  @Input() isCaseView: boolean;
  @ViewChild('materialNumberInput')
  matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  matDescInput: AutocompleteInputComponent;
  @ViewChild('customerMaterialNumberInput')
  customerMatNumberInput: AutocompleteInputComponent;

  // TODO: make this private when the new case creation is fully implemented
  readonly autoCompleteFacade: AutoCompleteFacade = inject(AutoCompleteFacade);
  private readonly createCaseFacade = inject(CreateCaseFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly processCaseFacade = inject(ProcessCaseFacade);
  private readonly destroyRef = inject(DestroyRef);

  private readonly pasteMaterialsService: PasteMaterialsService = inject(
    PasteMaterialsService
  );
  private readonly matSnackBar: MatSnackBar = inject(MatSnackBar);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);

  // ########################################################################
  // ######################### Observables ##################################
  // ########################################################################
  customerIdentifierForCaseCreation$: Observable<CustomerId> =
    this.createCaseFacade.customerIdentifier$;
  customerIdentifierForActiveCase$: Observable<CustomerId> =
    this.activeCaseFacade.quotationCustomer$.pipe(
      map((customer: Customer) => customer.identifier)
    );
  customerIdForCaseCreation$: Observable<string> =
    this.createCaseFacade.customerIdForCaseCreation$;

  materialDescAutocompleteLoading$: Observable<boolean> =
    this.autoCompleteFacade.materialDescAutocompleteLoading$;
  materialDescForCreateCase$: Observable<CaseFilterItem> =
    this.autoCompleteFacade.materialDescForCreateCase$;
  materialDescForAddEntry$: Observable<CaseFilterItem> =
    this.autoCompleteFacade.materialDescForAddEntry$;

  materialNumberAutocompleteLoading$: Observable<boolean> =
    this.autoCompleteFacade.materialNumberAutocompleteLoading$;
  materialNumberForCreateCase$: Observable<CaseFilterItem> =
    this.autoCompleteFacade.materialNumberForCreateCase$;
  materialNumberForAddEntry$: Observable<CaseFilterItem> =
    this.autoCompleteFacade.materialNumberForAddEntry$;

  customerMaterialNumberLoading$: Observable<boolean> =
    this.autoCompleteFacade.customerMaterialNumberLoading$;
  customerMaterialNumberForCreateCase$: Observable<CaseFilterItem> =
    this.autoCompleteFacade.customerMaterialNumberForCreateCase$;
  customerMaterialNumberForAddEntry$: Observable<CaseFilterItem> =
    this.autoCompleteFacade.customerMaterialNumberForAddEntry$;

  selectedMaterialAutocomplete$: Observable<IdValue> =
    this.autoCompleteFacade.getSelectedAutocompleteMaterialNumber$;

  selectedAutocompleteRequestDialog$: Observable<AutocompleteRequestDialog> =
    this.autoCompleteFacade.getSelectedAutocompleteRequestDialog$;

  newCaseCreation: boolean = this.featureToggleConfigService.isEnabled(
    'createManualCaseAsView'
  );

  CUSTOMER_MATERIAL_MAX_LENGTH = 35;
  materialNumber$: Observable<CaseFilterItem>;
  materialDesc$: Observable<CaseFilterItem>;
  autoSelectMaterial$: Observable<CaseFilterItem>;

  materialNumberInput: boolean;
  customerMaterialInput: boolean;
  materialInputIsValid = false;
  addRowEnabled = false;

  quantityFormControl: FormControl = new FormControl(
    { value: null, disabled: true },
    [],
    this.newCaseCreation
      ? [quantityDeliveryUnitValidator(this.selectedMaterialAutocomplete$)]
      : []
  );
  targetPriceFormControl: FormControl = new FormControl({
    value: undefined,
    disabled: true,
  });
  targetPriceSourceFormControl: FormControl = new FormControl({
    value: TargetPriceSource.NO_ENTRY,
    disabled: true,
  });
  addEntryFormGroup: FormGroup = new FormGroup({
    quantityFormControl: this.quantityFormControl,
    targetPriceFormControl: this.targetPriceFormControl,
    targetPriceSourceFormControl: this.targetPriceSourceFormControl,
  });

  public ngOnInit(): void {
    if (this.newCaseCreation) {
      this.selectedAutocompleteRequestDialog$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((dialog) => dialog === AutocompleteRequestDialog.EDIT_MATERIAL)
        )
        .subscribe(() => {
          this.clearFields();
        });
    }
    if (this.newCaseCreation && this.isCaseView) {
      this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.CREATE_CASE);

      combineLatest([
        this.createCaseFacade.customerIdForCaseCreation$,
        this.createCaseFacade.selectedCustomerSalesOrg$,
      ])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([id, salesOrg]) => {
          if (!!id || !!salesOrg) {
            this.autoCompleteFacade.resetAutocompleteMaterials();
            this.clearFields();
          } else {
            this.enableNonAutoCompleteFields();
          }
        });
    } else {
      this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.ADD_ENTRY);
    }

    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.targetPriceFormControl.setValidators([
      priceValidator(this.translocoLocaleService.getLocale()).bind(this),
    ]);
    this.targetPriceFormControl.markAllAsTouched();
    this.targetPriceFormControl.valueChanges.subscribe((data) => {
      this.targetPriceSourceFormControl.setValue(
        getTargetPriceSourceValue(
          data,
          this.targetPriceFormControl.valid,
          this.targetPriceSourceFormControl.value
        ),
        { emitEvent: false }
      );
    });

    this.targetPriceSourceFormControl.valueChanges.subscribe((data) => {
      this.targetPriceFormControl.setValue(
        getTargetPriceValue(data, this.targetPriceFormControl.value),
        { emitEvent: false }
      );
    });
    this.quantityFormControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.quantityFormControl.markAsTouched();
        this.rowInputValid();
      });

    if (this.newCaseCreation) {
      this.selectedMaterialAutocomplete$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((material) => !!material)
        )
        .subscribe(({ deliveryUnit }) => {
          this.adjustQuantityFormFieldToDeliveryUnit(deliveryUnit);
        });

      // get the customer depending on the page
      iif(
        () => this.isCaseView,
        this.customerIdForCaseCreation$,
        this.customerIdentifierForActiveCase$
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((customer: string | CustomerId) => {
          if (customer) {
            this.enableNonAutoCompleteFields();
          } else {
            this.disableNonAutoCompleteFields();
          }
        });
    } else {
      this.enableNonAutoCompleteFields();
    }
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
      this.targetPriceFormControl.valid &&
      this.quantityFormControl.valid &&
      this.quantityFormControl.value;
  }

  addRow(): void {
    const targetPriceValue = this.targetPriceFormControl.value;
    const targetPriceSourceValue =
      this.targetPriceSourceFormControl.value === TargetPriceSource.NO_ENTRY ||
      !targetPriceValue
        ? undefined
        : this.targetPriceSourceFormControl.value;

    const items: MaterialTableItem[] = [
      {
        materialNumber: this.matNumberInput.searchFormControl.value,
        materialDescription: this.matDescInput.searchFormControl.value,
        quantity: this.quantityFormControl.value,
        targetPrice:
          parseNullableLocalizedInputValue(
            this.targetPriceFormControl.value?.toString(),
            this.translocoLocaleService.getLocale()
          ) ?? undefined,
        customerMaterialNumber: this.newCaseCreation
          ? this.customerMatNumberInput.searchFormControl.value
          : undefined,
        targetPriceSource: this.newCaseCreation
          ? targetPriceSourceValue
          : undefined,
        info: {
          valid: false,
          description: [ValidationDescription.Not_Validated],
        },
      },
    ];
    // dispatch action depending on page
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isCaseView
      ? this.createCaseFacade.addRowDataItems(items)
      : this.processCaseFacade.addItemsToMaterialTable(items);

    this.clearFields();
  }

  onQuantityKeyPress(event: KeyboardEvent): void {
    if (event.key === Keyboard.ENTER && this.addRowEnabled) {
      this.addRow();

      return;
    }

    validateQuantityInputKeyPress(event);
  }

  pasteFromClipboard() {
    this.pasteMaterialsService.onPasteStart(
      this.isCaseView,
      this.newCaseCreation
    );
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

  // ########################################################################
  // ######################### auto complete methods ########################
  // ########################################################################
  autocomplete(
    autocompleteSearch: AutocompleteSearch,
    customerId?: CustomerId
  ): void {
    this.autoCompleteFacade.autocomplete(autocompleteSearch, customerId);
  }

  autocompleteUnselectOptions(autocompleteFilter: string): void {
    this.autoCompleteFacade.unselectOptions(autocompleteFilter);
  }

  autocompleteSelectMaterialNumberDescriptionOrCustomerMaterial(
    option: IdValue,
    autocompleteFilter: string
  ): void {
    this.autoCompleteFacade.selectMaterialNumberDescriptionOrCustomerMaterial(
      option,
      autocompleteFilter
    );
  }

  // ##################################################################
  // ######################### private methods ########################
  // ##################################################################
  private clearFields(): void {
    // clear fields after dispatching action
    this.matNumberInput.clearInput();
    this.matDescInput.clearInput();

    this.quantityFormControl.reset();

    this.targetPriceFormControl.reset();

    this.materialInputIsValid = false;

    if (this.newCaseCreation) {
      this.customerMatNumberInput.clearInput();
      this.targetPriceSourceFormControl.setValue(TargetPriceSource.NO_ENTRY);
    }
  }

  private enableNonAutoCompleteFields(): void {
    this.quantityFormControl.enable();
    this.targetPriceFormControl.enable();
    if (this.newCaseCreation) {
      this.targetPriceSourceFormControl.enable();
    }
  }

  private disableNonAutoCompleteFields(): void {
    this.quantityFormControl.disable();
    this.targetPriceFormControl.disable();
    if (this.newCaseCreation) {
      this.targetPriceSourceFormControl.disable();
    }
  }
  /**
   * The quantity form Field will have a value that is a multiple of the delivery unit
   * when the next possible multiple is higher than the current quantity Value, the next higher multiple will be taken
   * the amount of delivery is the minimum quantity Value
   * @param deliveryUnit deliveryUnit of the selected material
   */
  private adjustQuantityFormFieldToDeliveryUnit(deliveryUnit: number): void {
    // find the next multiple of delivery unit starting from the quantity value
    const nextMultiple = getNextHigherPossibleMultiple(
      this.quantityFormControl.value,
      deliveryUnit
    );

    if (nextMultiple > this.quantityFormControl.value) {
      this.quantityFormControl.setValue(nextMultiple);
      this.quantityFormControl.updateValueAndValidity();
    }
  }
}
