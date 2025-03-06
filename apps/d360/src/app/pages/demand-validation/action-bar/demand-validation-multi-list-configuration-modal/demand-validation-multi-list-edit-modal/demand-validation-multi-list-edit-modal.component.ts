import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { lastValueFrom, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import { IRowNode } from 'ag-grid-enterprise';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../../feature/demand-validation/demand-validation.service';
import {
  DemandValidationBatch,
  DemandValidationBatchResponse,
  MaterialType,
} from '../../../../../feature/demand-validation/model';
import { listUploadPeriodTypeValueFormatter } from '../../../../../shared/ag-grid/grid-value-formatter';
import { DateOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/date-or-original-cell-renderer/date-or-original-cell-renderer.component';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { ColumnForUploadTable } from '../../../../../shared/components/table-upload-modal/models';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../shared/utils/error-handling';
import {
  parseDateIfPossible,
  parseDemandValidationPeriodTypeIfPossible,
} from '../../../../../shared/utils/parse-values';
import { validateMaterialNumber } from '../../../../../shared/utils/validation/filter-validation';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { ErrorMessage } from '../../../../alert-rules/table/components/modals/alert-rule-logic-helper';

interface DemandValidationMultiListEditModalProps {
  customerName: string;
  customerNumber: string;
  materialType: MaterialType;
}

@Component({
  selector: 'd360-demand-validation-multi-list-edit-modal',
  imports: [
    SharedTranslocoModule,
    MatButton,
    AgGridModule,
    MatDialogModule,
    MatIcon,
    MatButtonModule,
    LoadingSpinnerModule,
  ],
  templateUrl:
    './../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.html',
})
export class DemandValidationMultiListEditModalComponent extends AbstractTableUploadModalComponent<
  DemandValidationBatch,
  DemandValidationBatchResponse
> {
  private readonly data: DemandValidationMultiListEditModalProps =
    inject(MAT_DIALOG_DATA);
  private readonly demandValidationService = inject(DemandValidationService);

  protected modalMode: 'save' | 'delete' = 'save';
  protected title = `${translate('validation_of_demand.upload_modal.list.title')} - ${this.data.customerName}`;
  protected maxRows = 200;

  protected apiCall =
    this.demandValidationService.saveValidatedDemandBatch.bind(
      this.demandValidationService
    );

  private readonly mandatoryFields: (keyof Partial<DemandValidationBatch>)[] = [
    'id',
    'material',
    'dateString',
    'forecast',
    'periodType',
  ] as const;

  protected getTypedRowData(rowNode: IRowNode): DemandValidationBatch {
    return {
      id: rowNode.id,
      material: rowNode.data.material,
      dateString: rowNode.data.dateString,
      forecast: rowNode.data.forecast,
      periodType: rowNode.data.periodType,
    };
  }

  protected applyFunction(
    data: DemandValidationBatch[],
    dryRun: boolean
  ): Promise<PostResult<DemandValidationBatchResponse>> {
    return lastValueFrom(
      this.apiCall(
        data,
        this.data.customerNumber,
        dryRun,
        this.data.materialType
      ).pipe(take(1), takeUntilDestroyed(this.destroyRef))
    );
  }

  protected parseErrorsFromResult(
    result: PostResult<DemandValidationBatchResponse>
  ): ErrorMessage<DemandValidationBatch>[] {
    const errors: ErrorMessage<DemandValidationBatch>[] = [];
    result.response.forEach((r) => {
      if (r.result.messageType === 'ERROR') {
        errors.push({
          dataIdentifier: {
            material: r.materialNumber,
          },
          errorMessage: errorsFromSAPtoMessage(r.result),
        });
      }
    });

    return errors;
  }

  protected columnDefinitions: ColumnForUploadTable<DemandValidationBatch>[] = [
    {
      headerName:
        this.data.materialType === 'schaeffler'
          ? translate('validation_of_demand.upload_modal.material_number')
          : translate(
              'validation_of_demand.upload_modal.customer_material_number'
            ),
      field: 'material',
      editable: true,
    },
    {
      headerName: translate('validation_of_demand.upload_modal.list.date_from'),
      editable: true,
      field: 'dateString',
      validationFn: ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
      cellRenderer: DateOrOriginalCellRendererComponent,
    },
    {
      headerName: translate('validation_of_demand.upload_modal.list.forecast'),
      validationFn:
        ValidationHelper.detectLocaleAndValidateForLocalFloat.bind(this),
      editable: true,
      field: 'forecast',
    },
    {
      headerName: translate(
        'validation_of_demand.upload_modal.list.period_type.rootString'
      ),
      field: 'periodType',
      editable: true,
      valueFormatter: listUploadPeriodTypeValueFormatter(),
      cellEditor: 'agRichSelectCellEditor',
      cellEditorPopup: true,
      cellEditorParams: {
        valueFormatter: listUploadPeriodTypeValueFormatter(),
        values: ['week', 'month'],
      },
    },
  ];

  protected checkDataForErrors(
    data: DemandValidationBatch[]
  ): ErrorMessage<DemandValidationBatch>[] {
    const errors: ErrorMessage<DemandValidationBatch>[] = [];

    data.forEach((demandValidationBatch) => {
      errors.push(
        ...this.mandatoryFieldCheck(demandValidationBatch),
        ...this.materialNumberCheck(demandValidationBatch)
      );
    });

    return errors;
  }

  protected specialParseFunctionsForFields: Map<
    keyof DemandValidationBatch,
    (value: string) => string
  > = new Map([
    ['periodType', parseDemandValidationPeriodTypeIfPossible],
    ['dateString', (value: string) => parseDateIfPossible(value)],
  ]);

  private mandatoryFieldCheck(demandValidationBatch: DemandValidationBatch) {
    const errors: ErrorMessage<DemandValidationBatch>[] = [];

    errors.push(
      ...this.mandatoryFields
        .filter((mandatoryField) => !demandValidationBatch[mandatoryField])
        .map((mandatoryField) => ({
          dataIdentifier: { ...demandValidationBatch },
          specificField: mandatoryField,
          errorMessage: translate('generic.validation.missing_fields'),
        }))
    );

    return errors;
  }

  private materialNumberCheck(demandValidationBatch: DemandValidationBatch) {
    const errors: ErrorMessage<DemandValidationBatch>[] = [];

    if (
      demandValidationBatch.material &&
      this.data.materialType === 'schaeffler'
    ) {
      const validationResult = validateMaterialNumber(
        demandValidationBatch.material.replaceAll('-', '')
      );

      if (validationResult) {
        errors.push({
          dataIdentifier: { ...demandValidationBatch },
          specificField: 'material',
          errorMessage: validationResult.join('\n'),
        });
      }
    }

    return errors;
  }
}
