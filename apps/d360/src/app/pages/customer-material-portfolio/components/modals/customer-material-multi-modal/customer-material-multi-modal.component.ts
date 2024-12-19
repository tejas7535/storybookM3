import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { lastValueFrom, take } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgGridModule } from 'ag-grid-angular';
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import {
  CMPBulkPhaseInEntity,
  CMPMaterialPhaseInResponse,
} from '../../../../../feature/customer-material-portfolio/model';
import {
  DemandCharacteristic,
  demandCharacteristicOptions,
} from '../../../../../feature/material-customer/model';
import { SelectableValueOrOriginalCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/selectable-value-or-original/selectable-value-or-original.component';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../../../shared/components/inputs/display-functions.utils';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { ColumnForUploadTable } from '../../../../../shared/components/table-upload-modal/models';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../shared/utils/error-handling';
import {
  formatISODateToISODateString,
  parseDateIfPossible,
  parseDemandCharacteristicIfPossible,
} from '../../../../../shared/utils/parse-values';
import { validateDemandCharacteristicType } from '../../../../../shared/utils/validation/data-validation';
import { validateMaterialNumber } from '../../../../../shared/utils/validation/filter-validation';
import { ErrorMessage } from '../../../../alert-rules/table/components/modals/alert-rule-logic-helper';
import { ValidationHelper } from './../../../../../shared/utils/validation/validation-helper';

interface MultiPhaseInData {
  materialNumber: string | null;
  phaseInDate: Date | null;
  demandCharacteristic: DemandCharacteristic | null;
}

@Component({
  selector: 'd360-customer-material-multi-modal',
  standalone: true,
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
  styleUrl:
    './../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component.scss',
})
export class CustomerMaterialMultiModalComponent extends AbstractTableUploadModalComponent<
  MultiPhaseInData,
  CMPMaterialPhaseInResponse
> {
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly cMPService: CMPService = inject(CMPService);

  private readonly data: { customerNumber: string } = inject(MAT_DIALOG_DATA);

  protected maxRows = 200;

  protected title: string = translate(
    'new-customer_material_portfolio.modal.headline'
  );
  protected description: string = translate(
    'new-customer_material_portfolio.modal.subheadline'
  );
  protected modalMode: 'save' | 'delete' = 'save';

  protected get columnDefinitions(): ColumnForUploadTable<MultiPhaseInData>[] {
    const options: SelectableValue[] = demandCharacteristicOptions.map(
      (id) => ({ id, text: translate(`demand_characteristics.${id}`) })
    );

    return [
      {
        headerName: translate(
          'validation_of_demand.upload_modal.material_number'
        ),
        field: 'materialNumber',
        editable: true,
        validationFn: ValidationHelper.condenseErrorsFromValidation(
          validateMaterialNumber
        ),
      },
      {
        headerName: translate(
          'customer-material-portfolio.upload_modal.modal.phase_in'
        ),
        editable: true,
        field: 'phaseInDate',
        validationFn:
          ValidationHelper.validateDateFormatAndGreaterEqualThanToday,
        // Value formatter to remove "DateOrOriginalCellRenderer"
        valueFormatter: (params: ValueFormatterParams) =>
          params.value
            ? parseDateIfPossible(params.value, this.translocoLocaleService)
            : null,
      },
      {
        field: 'demandCharacteristic',
        headerName: translate(
          'customer-material-portfolio.upload_modal.modal.demand_type'
        ),
        editable: true,
        validationFn: validateDemandCharacteristicType,
        cellRenderer: SelectableValueOrOriginalCellRendererComponent,
        cellRendererParams: {
          options,
          getLabel: DisplayFunctions.displayFnText,
        },
        cellEditorParams: {
          cellRenderer: (params: ICellRendererParams) => {
            const parsed = params.value
              ? parseDemandCharacteristicIfPossible(params.value)
              : null;

            return parsed
              ? translate(`field.demandCharacteristic.value.${parsed}`)
              : null;
          },
          values: demandCharacteristicOptions,
        },
        cellEditor: 'agRichSelectCellEditor',
        cellEditorPopup: true,
        width: 220,
      },
    ];
  }

  protected applyFunction(
    data: MultiPhaseInData[],
    dryRun: boolean
  ): Promise<PostResult<CMPMaterialPhaseInResponse>> {
    return lastValueFrom(
      this.cMPService
        .saveBulkPhaseIn(
          {
            customerNumber: this.data.customerNumber,
            phaseInEntities: data.map(
              (row) =>
                ({
                  materialNumber: row.materialNumber || null,
                  phaseInDate: formatISODateToISODateString(row.phaseInDate),
                  demandCharacteristic: row.demandCharacteristic || null,
                }) as CMPBulkPhaseInEntity
            ),
          },
          dryRun
        )
        .pipe(take(1), takeUntilDestroyed(this.destroyRef))
    );
  }

  protected parseErrorsFromResult(
    result: PostResult<CMPMaterialPhaseInResponse>
  ): ErrorMessage<MultiPhaseInData>[] {
    return result.response
      .map((response) =>
        response.result.messageType === 'ERROR'
          ? {
              dataIdentifier: { materialNumber: response.materialNumber },
              errorMessage: errorsFromSAPtoMessage(response.result),
            }
          : null
      )
      .filter((error) => error !== null);
  }

  protected checkDataForErrors(
    data: MultiPhaseInData[]
  ): ErrorMessage<MultiPhaseInData>[] {
    // eslint-disable-next-line unicorn/no-array-reduce
    return data.reduce((errors, entry) => {
      for (const key of [
        'demandCharacteristic',
        'materialNumber',
        'phaseInDate',
      ]) {
        if (!entry[key as keyof MultiPhaseInData]) {
          errors.push({
            dataIdentifier: entry,
            specificField: key,
            errorMessage: translate('generic.validation.missing_fields'),
          });
        }
      }

      return errors;
    }, []);
  }

  protected specialParseFunctionsForFields: Map<
    keyof MultiPhaseInData,
    (value: string) => string
  > = new Map([
    ['demandCharacteristic', parseDemandCharacteristicIfPossible],
    [
      'phaseInDate',
      (value: string) =>
        parseDateIfPossible(value, this.translocoLocaleService),
    ],
  ]);
}
