/* eslint-disable @typescript-eslint/member-ordering */
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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

import { Observable } from 'rxjs';

import { addRowDataItems } from '@gq/core/store/actions';
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

import { Keyboard } from '../../../models';
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
    TargetPriceSource.CUSTOMER,
    TargetPriceSource.SALES,
  ];

  public ngOnInit(): void {
    if (this.newCaseCreation && this.isCaseView) {
      this.autoCompleteFacade.initFacade(AutocompleteRequestDialog.CREATE_CASE);
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
          ? this.targetPriceSourceFormControl.value
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

    // clear fields after dispatching action
    this.matNumberInput.clearInput();
    this.matDescInput.clearInput();
    this.customerMatNumberInput.clearInput();
    this.quantityFormControl.reset();
    this.targetPriceFormControl.reset();
    this.targetPriceSourceFormControl.setValue(TargetPriceSource.NO_ENTRY);
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
