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
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { combineLatest, filter, map, Observable } from 'rxjs';

import { addRowDataItems } from '@gq/core/store/actions';
import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { ProcessCaseActions } from '@gq/core/store/process-case';
import { CaseFilterItem } from '@gq/core/store/reducers/models';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TargetPriceSource } from '@gq/shared/models/quotation/target-price-source.enum';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';
import {
  parseNullableLocalizedInputValue,
  validateQuantityInputKeyPress,
} from '@gq/shared/utils/misc.utils';
import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Customer, CustomerId, Keyboard } from '../../../models';
import { MaterialTableItem } from '../../../models/table/material-table-item-model';
import { ValidationDescription } from '../../../models/table/validation-description.enum';
import { PasteMaterialsService } from '../../../services/paste-materials/paste-materials.service';
import { priceValidator } from '../../../validators/price-validator';
import { AutocompleteInputComponent } from '../../autocomplete-input/autocomplete-input.component';
import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { InfoIconModule } from '../../info-icon/info-icon.module';
@Component({
  selector: 'gq-add-entry',
  templateUrl: './add-entry.component.html',
  standalone: true,
  imports: [
    AutocompleteInputComponent,
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
  ],
})
export class AddEntryComponent implements OnInit, OnDestroy {
  @Input() readonly isCaseView: boolean;
  @ViewChild('materialNumberInput')
  matNumberInput: AutocompleteInputComponent;
  @ViewChild('materialDescInput')
  matDescInput: AutocompleteInputComponent;
  @ViewChild('customerMaterialNumberInput')
  customerMatNumberInput: AutocompleteInputComponent;

  readonly autoCompleteFacade: AutoCompleteFacade = inject(AutoCompleteFacade);
  private readonly createCaseFacade = inject(CreateCaseFacade);
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly destroyRef = inject(DestroyRef);

  private readonly store: Store = inject(Store);
  private readonly pasteMaterialsService: PasteMaterialsService = inject(
    PasteMaterialsService
  );
  private readonly matSnackBar: MatSnackBar = inject(MatSnackBar);
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly featureToggleConfigService: FeatureToggleConfigService =
    inject(FeatureToggleConfigService);
  newCaseCreation: boolean = this.featureToggleConfigService.isEnabled(
    'createManualCaseAsView'
  );

  CUSTOMER_MATERIAL_MAX_LENGTH = 35;
  materialNumber$: Observable<CaseFilterItem>;
  materialDesc$: Observable<CaseFilterItem>;
  autoSelectMaterial$: Observable<CaseFilterItem>;
  materialNumberAutocompleteLoading$: Observable<boolean>;
  materialDescAutocompleteLoading$: Observable<boolean>;
  materialNumberInput: boolean;
  customerMaterialHasInput: boolean;
  quantity: number;
  materialInputIsValid = false;
  quantityValid = false;
  addRowEnabled = false;
  quantityFormControl: UntypedFormControl = new UntypedFormControl();
  targetPriceFormControl: FormControl = new FormControl();
  targetPriceSourceFormControl: FormControl = new FormControl({
    value: TargetPriceSource.NO_ENTRY,
    disabled: false,
  });
  targetPriceSources: string[] = [
    TargetPriceSource.NO_ENTRY,
    TargetPriceSource.INTERNAL,
    TargetPriceSource.CUSTOMER,
  ];

  customerIdentifierForCaseCreation$: Observable<CustomerId> =
    this.createCaseFacade.customerIdentifier$;
  customerIdentifierForActiveCase$: Observable<CustomerId> =
    this.activeCaseFacade.quotationCustomer$.pipe(
      map((customer: Customer) => customer.identifier)
    );
  customerIdForCaseCreation$: Observable<string> =
    this.createCaseFacade.customerIdForCaseCreation$;

  public ngOnInit(): void {
    if (this.newCaseCreation && this.isCaseView) {
      this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.CREATE_CASE);

      combineLatest([
        this.createCaseFacade.customerIdForCaseCreation$,
        this.createCaseFacade.selectedCustomerSalesOrg$,
      ])
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter(([id, salesOrg]) => !!id || !!salesOrg)
        )
        .subscribe(() => {
          this.autoCompleteFacade.resetAutocompleteMaterials();
          this.clearFields();
        });
    } else {
      this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.ADD_ENTRY);
    }

    this.addSubscriptions();
  }

  addSubscriptions(): void {
    this.quantityFormControl.setValidators([this.quantityValidator.bind(this)]);
    this.targetPriceFormControl.setValidators([
      priceValidator(this.translocoLocaleService.getLocale()).bind(this),
    ]);
    this.targetPriceFormControl.markAllAsTouched();
    this.targetPriceFormControl.valueChanges.subscribe((data) => {
      if (
        data &&
        this.targetPriceSourceFormControl.value ===
          TargetPriceSource.NO_ENTRY &&
        this.targetPriceFormControl.valid
      ) {
        this.targetPriceSourceFormControl.setValue(TargetPriceSource.INTERNAL, {
          emitEvent: false,
        });

        return;
      }
      if (!data || data === '') {
        this.targetPriceSourceFormControl.setValue(TargetPriceSource.NO_ENTRY, {
          emitEvent: false,
        });

        return;
      }
    });

    this.targetPriceSourceFormControl.valueChanges.subscribe((data) => {
      if (
        data &&
        data === TargetPriceSource.NO_ENTRY &&
        this.targetPriceFormControl.value
      ) {
        this.targetPriceFormControl.reset(null, { emitEvent: false });
      }
    });
  }

  quantityValidator(control: AbstractControl): ValidationErrors {
    const { value } = control;
    // input field should stay green when empty
    this.quantityValid = !value || value > 0;
    this.quantity = value;
    this.rowInputValid();

    return this.quantityValid
      ? undefined
      : { invalidInput: !this.quantityValid };
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
        quantity: this.quantity,
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
      ? this.store.dispatch(addRowDataItems({ items }))
      : this.store.dispatch(
          ProcessCaseActions.addNewItemsToMaterialTable({ items })
        );

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
}
