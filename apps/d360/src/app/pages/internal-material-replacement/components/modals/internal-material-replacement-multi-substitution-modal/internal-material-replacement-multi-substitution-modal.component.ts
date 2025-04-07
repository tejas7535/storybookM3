import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { lastValueFrom, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import { parse } from 'date-fns';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import {
  IMRSubstitution,
  IMRSubstitutionResponse,
  replacementTypeValues,
} from '../../../../../feature/internal-material-replacement/model';
import { replacementTypeValueFormatter } from '../../../../../shared/ag-grid/grid-value-formatter';
import { DateOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/date-or-original-cell-renderer/date-or-original-cell-renderer.component';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { ColumnForUploadTable } from '../../../../../shared/components/table-upload-modal/models';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../shared/utils/error-handling';
import {
  formatISODateToISODateString,
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
import { MessageType } from './../../../../../shared/models/message-type.enum';

@Component({
  selector: 'd360-internal-material-replacement-multi-substitution-modal',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    AgGridModule,
    MatDialogModule,
    MatIcon,
    MatButtonModule,
    LoadingSpinnerModule,
  ],
  templateUrl:
    './../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.html',
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

  /** @inheritdoc */
  protected specialParseFunctionsForFields: Map<
    keyof IMRSubstitution,
    (value: string) => string
  > = new Map([
    ['replacementType', parseReplacementTypeIfPossible],
    ['replacementDate', (value: string) => parseDateIfPossible(value)],
    ['cutoverDate', (value: string) => parseDateIfPossible(value)],
    ['startOfProduction', (value: string) => parseDateIfPossible(value)],
  ]);

  /** @inheritdoc */
  public ngOnInit(): void {
    super.ngOnInit();
  }

  protected getMultiSubstitutionModalColumns(): ColumnForUploadTable<IMRSubstitution>[] {
    return [
      {
        field: 'replacementType',
        headerName: translate(
          'internal_material_replacement.column.replacementType'
        ),
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
        headerName: translate('material_customer.column.region'),
        editable: true,
      },
      {
        field: 'salesArea',
        headerName: translate('material_customer.column.salesArea'),
        editable: true,
      },
      {
        field: 'salesOrg',
        headerName: translate('material_customer.column.salesOrg'),
        editable: true,
      },
      {
        field: 'customerNumber',
        headerName: translate('material_customer.column.customerNumber'),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateCustomerNumber
        ),
      },
      {
        field: 'predecessorMaterial',
        headerName: translate(
          'internal_material_replacement.column.predecessorMaterial'
        ),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        field: 'successorMaterial',
        headerName: translate(
          'internal_material_replacement.column.successorMaterial'
        ),
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        field: 'startOfProduction',
        headerName: translate(
          'internal_material_replacement.column.startOfProduction'
        ),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
        cellRenderer: DateOrOriginalCellRendererComponent,
      },
      {
        field: 'cutoverDate',
        headerName: translate(
          'internal_material_replacement.column.cutoverDate'
        ),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
        cellRenderer: DateOrOriginalCellRendererComponent,
      },
      {
        field: 'replacementDate',
        headerName: translate(
          'internal_material_replacement.column.replacementDate'
        ),
        editable: true,
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
        cellRenderer: DateOrOriginalCellRendererComponent,
      },
      {
        field: 'note',
        headerName: translate('internal_material_replacement.column.note'),
        editable: true,
      },
    ];
  }

  /** @inheritdoc */
  protected parseErrorsFromResult(
    res: PostResult<IMRSubstitutionResponse>
  ): ErrorMessage<IMRSubstitution>[] {
    const errors: ErrorMessage<IMRSubstitution>[] = [];
    res.response.forEach((r) => {
      if (r.result.messageType === MessageType.Error) {
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

  /** @inheritdoc */
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
            errorMessage: translate('generic.validation.missing_fields'),
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
              'internal_material_replacement.error.fieldNotAllowed'
            ),
          }));
        errors.push(...forbiddenFieldErrors);
      }
    });

    return errors;
  }

  /** @inheritdoc */
  protected override onAdded(): void {
    this.dialogRef.close(true);
  }

  /** @inheritdoc */
  protected applyFunction(
    data: IMRSubstitution[],
    dryRun: boolean
  ): Promise<PostResult<IMRSubstitutionResponse>> {
    const getIsoString: (date: string | Date) => string | null = (
      date: string | Date
    ) =>
      date
        ? formatISODateToISODateString(
            parse(String(date), ValidationHelper.getDateFormat(), new Date())
          )
        : null;

    return lastValueFrom(
      this.apiCall(
        data.map((row) => ({
          ...row,
          replacementDate: getIsoString(row.replacementDate),
          cutoverDate: getIsoString(row.cutoverDate),
          startOfProduction: getIsoString(row.startOfProduction),
        })),
        dryRun
      ).pipe(take(1), takeUntilDestroyed(this.destroyRef))
    );
  }
}
