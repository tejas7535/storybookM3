import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { lastValueFrom, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridModule } from 'ag-grid-angular';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import {
  IMRSubstitution,
  IMRSubstitutionResponse,
  replacementTypeValues,
} from '../../../../../feature/internal-material-replacement/model';
import { replacementTypeValueFormatter } from '../../../../../shared/ag-grid/grid-value-formatter';
import { ActionButtonComponent } from '../../../../../shared/components/action-button/action-button.component';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { ColumnForUploadTable } from '../../../../../shared/components/table-upload-modal/models';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../shared/utils/error-handling';
import {
  parseDateIfPossible,
  parseReplacementTypeIfPossible,
} from '../../../../../shared/utils/parse-values';
import { validateReplacementType } from '../../../../../shared/utils/validation/data-validation';
import {
  validateCustomerNumber,
  validateMaterialNumber,
} from '../../../../../shared/utils/validation/filter-validation';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { ErrorMessage } from '../../../../alert-rules/table/components/modals/alert-rule-logic-helper';
import {
  checkForbiddenFieldsForNewSubstitution,
  checkMissingFields,
} from '../internal-material-replacement-logic-helper';

@Component({
  selector: 'd360-internal-material-replacement-multi-substitution-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule,
    MatDialogModule,
    MatIcon,
    MatButtonModule,
    ActionButtonComponent,
    LoadingSpinnerModule,
  ],
  templateUrl:
    './../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.html',
  styleUrl:
    './../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.scss',
})
export class InternalMaterialReplacementMultiSubstitutionModalComponent
  extends AbstractTableUploadModalComponent<
    IMRSubstitution,
    IMRSubstitutionResponse
  >
  implements OnInit
{
  /**
   * The AlertRulesService instance.
   *
   * @type {MatDialogRef<InternalMaterialReplacementMultiSubstitutionModalComponent>}
   * @memberof InternalMaterialReplacementMultiSubstitutionModalComponent
   */
  public dialogRef: MatDialogRef<InternalMaterialReplacementMultiSubstitutionModalComponent> =
    inject(
      MatDialogRef<InternalMaterialReplacementMultiSubstitutionModalComponent>
    );

  private readonly imrService = inject(IMRService);

  private readonly translocoLocaleSerivce = inject(TranslocoLocaleService);

  /** @inheritdoc */
  protected title = translate(
    'internal_material_replacement.title.newSubstitutions'
  );

  /** @inheritdoc */
  protected modalMode: 'save' | 'delete' = 'save';

  /** @inheritdoc */
  protected maxRows: 200;

  /** @inheritdoc */
  protected apiCall = this.imrService.saveMultiIMRSubstitution.bind(
    this.imrService
  );

  /** @inheritdoc */
  protected columnDefinitions = this.getMultiSubstitutionModalColumns();

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected getMultiSubstitutionModalColumns(): ColumnForUploadTable<IMRSubstitution>[] {
    return [
      {
        field: 'replacementType',
        headerNameFn: () =>
          translate('internal_material_replacement.column.replacementType', {}),
        editable: true,
        validationFn: validateReplacementType,
        valueFormatter: replacementTypeValueFormatter(),
        cellEditor: 'agRichSelectCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
          values: replacementTypeValues,
        },
      },
      {
        field: 'region',
        headerNameFn: () => translate('material_customer.column.region', {}),
        editable: true,
      },
      {
        field: 'salesArea',
        headerNameFn: () => translate('material_customer.column.salesArea', {}),
        editable: true,
      },
      {
        field: 'salesOrg',
        headerNameFn: () => translate('material_customer.column.salesOrg', {}),
        editable: true,
      },
      {
        field: 'customerNumber',
        headerNameFn: () =>
          translate('material_customer.column.customerNumber', {}),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateCustomerNumber
        ),
      },
      {
        field: 'predecessorMaterial',
        headerNameFn: () =>
          translate(
            'internal_material_replacement.column.predecessorMaterial',
            {}
          ),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        field: 'successorMaterial',
        headerNameFn: () =>
          translate(
            'internal_material_replacement.column.successorMaterial',
            {}
          ),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        field: 'startOfProduction',
        headerNameFn: () =>
          translate(
            'internal_material_replacement.column.startOfProduction',
            {}
          ),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
      },
      {
        field: 'cutoverDate',
        headerNameFn: () =>
          translate('internal_material_replacement.column.cutoverDate', {}),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
      },
      {
        field: 'replacementDate',
        headerNameFn: () =>
          translate('internal_material_replacement.column.replacementDate', {}),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
      },
      {
        field: 'note',
        headerNameFn: () =>
          translate('internal_material_replacement.column.note', {}),
        editable: true,
      },
    ];
  }

  parseErrorsFromResult(
    res: PostResult<IMRSubstitutionResponse>
  ): ErrorMessage<IMRSubstitution>[] {
    const errors: ErrorMessage<IMRSubstitution>[] = [];
    res.response.forEach((r) => {
      if (r.result.messageType === 'ERROR') {
        errors.push({
          dataIdentifier: {
            replacementType: r.replacementType,
            region: r.region,
            salesArea: r.salesArea,
            salesOrg: r.salesOrg,
            customerNumber: r.customerNumber,
            predecessorMaterial: r.predecessorMaterial,
          },
          errorMessage: errorsFromSAPtoMessage(r.result),
        });
      }
    });

    return errors;
  }

  protected specialParseFunctionsForFields: Map<
    keyof IMRSubstitution,
    (value: string) => string
  > = new Map([
    ['replacementType', parseReplacementTypeIfPossible],
    [
      'replacementDate',
      (value: string) =>
        parseDateIfPossible(value, this.translocoLocaleSerivce),
    ],
    [
      'cutoverDate',
      (value: string) =>
        parseDateIfPossible(value, this.translocoLocaleSerivce),
    ],
    [
      'startOfProduction',
      (value: string) =>
        parseDateIfPossible(value, this.translocoLocaleSerivce),
    ],
  ]);

  protected checkDataForErrors(
    data: IMRSubstitution[]
  ): ErrorMessage<IMRSubstitution>[] {
    const errors: ErrorMessage<IMRSubstitution>[] = [];
    data.forEach((substitutionToAdd) => {
      const missingFields = checkMissingFields(substitutionToAdd);

      if (missingFields) {
        const missingFieldErrors: ErrorMessage<IMRSubstitution>[] =
          missingFields.map((field) => ({
            dataIdentifier: substitutionToAdd,
            specificField: field,
            errorMessage: translate('generic.validation.missing_fields', {}),
          }));
        errors.push(...missingFieldErrors);
      }

      const wronglyFilledFields =
        checkForbiddenFieldsForNewSubstitution(substitutionToAdd);
      if (wronglyFilledFields) {
        const forbiddenFieldErrors: ErrorMessage<IMRSubstitution>[] =
          wronglyFilledFields.map((field) => ({
            dataIdentifier: substitutionToAdd,
            specificField: field,
            errorMessage: translate(
              'internal_material_replacement.error.fieldNotAllowed',
              {}
            ),
          }));
        errors.push(...forbiddenFieldErrors);
      }
    });

    return errors;
  }

  /**
   * The onAdded callback.
   *
   * @memberof InternalMaterialReplacementMultiSubstitutionModalComponent
   */
  protected override onAdded(): void {
    this.dialogRef.close(true);
  }

  /** @inheritdoc */
  protected applyFunction(
    data: IMRSubstitution[],
    dryRun: boolean
  ): Promise<PostResult<IMRSubstitutionResponse>> {
    return lastValueFrom(
      this.apiCall(data, dryRun).pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
    );
  }
}
