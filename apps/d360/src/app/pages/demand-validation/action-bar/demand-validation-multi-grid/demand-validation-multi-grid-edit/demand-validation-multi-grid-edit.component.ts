/* eslint-disable max-lines */
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { lastValueFrom, take, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { AgGridModule } from 'ag-grid-angular';
import { IRowNode, ValueFormatterParams } from 'ag-grid-enterprise';
import { format, parseISO } from 'date-fns';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DemandValidationService } from '../../../../../feature/demand-validation/demand-validation.service';
import {
  DemandValidationBatch,
  DemandValidationBatchResponse,
  KpiBucket,
  KpiBucketTypeEnum,
  KpiDateRanges,
  MaterialType,
  WriteKpiEntry,
} from '../../../../../feature/demand-validation/model';
import { AbstractTableUploadModalComponent } from '../../../../../shared/components/table-upload-modal/abstract-table-upload-modal.component';
import { ColumnForUploadTable } from '../../../../../shared/components/table-upload-modal/models';
import {
  demandValidationPartialWeekColor,
  transparent,
} from '../../../../../shared/styles/colors';
import {
  errorsFromSAPtoMessage,
  PostResult,
} from '../../../../../shared/utils/error-handling';
import {
  parseAndFormatNumber,
  strictlyParseLocalFloat,
} from '../../../../../shared/utils/number';
import { validateMaterialNumber } from '../../../../../shared/utils/validation/filter-validation';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { ErrorMessage } from '../../../../alert-rules/table/components/modals/alert-rule-logic-helper';
import { DemandValidationKpiHeaderComponent } from '../../../tables/demand-validation-kpi-header/demand-validation-kpi-header.component';

interface DemandValidationMultiGridEditProps {
  customerName: string;
  customerNumber: string;
  materialType: MaterialType;
  dateRange: KpiDateRanges;
}

interface GridBatchUpload {
  id: string;
  materialNumber: string;
  [key: string]: string;
}

@Component({
  selector: 'd360-demand-validation-multi-list-edit-modal',
  standalone: true,
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
export class DemandValidationMultiGridEditComponent
  extends AbstractTableUploadModalComponent<
    GridBatchUpload,
    DemandValidationBatchResponse
  >
  implements OnInit
{
  private readonly data: DemandValidationMultiGridEditProps =
    inject(MAT_DIALOG_DATA);

  private readonly demandValidationService = inject(DemandValidationService);

  protected modalMode: 'save' | 'delete' = 'save';
  protected title = `${translate('validation_of_demand.upload_modal.grid.title')} - ${this.data.customerName}`;
  protected maxRows = 200;
  private errorRows: string[] = [];

  protected apiCall =
    this.demandValidationService.saveValidatedDemandBatch.bind(
      this.demandValidationService
    );

  private readonly kpiBuckets: WritableSignal<KpiBucket[]> = signal([]);
  protected columnDefinitions: ColumnForUploadTable<GridBatchUpload>[] = [];

  public constructor() {
    super();

    effect(() => {
      if (this.kpiBuckets().length > 0) {
        this.columnDefinitions = [
          {
            headerName:
              this.data.materialType === 'schaeffler'
                ? translate('validation_of_demand.upload_modal.material_number')
                : translate(
                    'validation_of_demand.upload_modal.customer_material_number'
                  ),
            field: 'materialNumber',
            editable: true,
            validationFn: (value: string, rowData: IRowNode) => {
              const result =
                this.data.materialType === 'schaeffler'
                  ? validateMaterialNumber(value)?.join(', ')
                  : null;

              if (result) {
                return result;
              } else if (this.errorRows.includes(rowData.id)) {
                return translate(
                  'validation_of_demand.upload_modal.error.incomplete_row'
                );
              }
              // TODO: add parse ID and IDX in Error Messages.

              return null;
            },
          },
          ...((this.kpiBuckets() || []).map((bucket) => {
            const date = parseISO(bucket.from);

            return {
              key: this.keyFromDate(date),
              field: this.keyFromDate(date),
              headerComponent: DemandValidationKpiHeaderComponent,
              headerComponentParams: {
                kpiEntry: {
                  bucketType: bucket.type,
                  fromDate: bucket.from,
                },
                disableClick: true,
              },
              editable: true,
              valueFormatter: this.parseAndFormatNumber.bind(this),
              bgColorFn: () =>
                bucket.type === KpiBucketTypeEnum.PARTIAL_WEEK
                  ? demandValidationPartialWeekColor
                  : transparent,
              validationFn: (value: string, _rowData: IRowNode) =>
                ValidationHelper.detectLocaleAndValidateForLocalFloat(value),
            };
          }) as ColumnForUploadTable<GridBatchUpload>[]),
        ];

        this.updateColumnDefinitions();
      }
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.demandValidationService
      .getKpiBuckets(this.data.dateRange)
      .pipe(
        take(1),
        tap((buckets) => {
          this.kpiBuckets.set([...buckets]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private readonly mandatoryFields: (keyof Partial<GridBatchUpload>)[] = [
    'materialNumber',
  ] as const;

  protected getTypedRowData(rowNode: IRowNode): GridBatchUpload {
    return {
      id: rowNode.id,
      ...rowNode.data,
    };
  }

  protected override getErrorMessageFn(action: 'save' | 'check' | 'validate') {
    // eslint-disable-next-line no-param-reassign
    action = action === 'check' ? 'validate' : action;

    return (count: number) =>
      translate(
        `validation_of_demand.upload_modal.${action}.${action === 'validate' ? 'invalid_rows' : 'invalid_entries'}`,
        { count }
      );
  }

  protected override getSuccessMessageFn(
    action: 'save' | 'check' | 'validate'
  ) {
    // eslint-disable-next-line no-param-reassign
    action = action === 'check' ? 'validate' : action;

    return () =>
      translate(`validation_of_demand.upload_modal.${action}.success`);
  }

  protected applyFunction(
    data: GridBatchUpload[],
    dryRun: boolean
  ): Promise<PostResult<DemandValidationBatchResponse>> {
    return lastValueFrom(
      this.apiCall(
        this.getDemandData(data),
        this.data.customerNumber,
        dryRun,
        this.data.materialType
      ).pipe(take(1), takeUntilDestroyed(this.destroyRef))
    );
  }

  protected parseErrorsFromResult(
    result: PostResult<DemandValidationBatchResponse>
  ): ErrorMessage<GridBatchUpload>[] {
    const errors: ErrorMessage<GridBatchUpload>[] = [];

    result.response.forEach((response) => {
      if (response.result.messageType === 'ERROR') {
        errors.push({
          id: response.id,
          dataIdentifier: { material: response.materialNumber },
          errorMessage: errorsFromSAPtoMessage(response.result),
        });
      }
    });

    return errors;
  }

  private keyFromDate(date: Date) {
    return date.toUTCString();
  }

  protected checkDataForErrors(
    data: GridBatchUpload[]
  ): ErrorMessage<GridBatchUpload>[] {
    const errors: ErrorMessage<GridBatchUpload>[] = [];
    this.errorRows = [];

    data.forEach((demandValidationBatch) => {
      errors.push(
        ...this.mandatoryFieldCheck(demandValidationBatch),
        ...this.materialNumberCheck(demandValidationBatch),
        ...this.forecastCheck(demandValidationBatch)
      );
    });

    return errors;
  }

  protected specialParseFunctionsForFields: Map<
    keyof DemandValidationBatch,
    (value: string) => string
  > = new Map([]);

  private mandatoryFieldCheck(demandValidationBatch: GridBatchUpload) {
    const errors: ErrorMessage<GridBatchUpload>[] = [];

    errors.push(
      ...this.mandatoryFields
        .filter((mandatoryField) => !demandValidationBatch[mandatoryField])
        .map((mandatoryField) => {
          this.errorRows.push(demandValidationBatch.id);

          return {
            id: demandValidationBatch.id,
            dataIdentifier: { ...demandValidationBatch },
            specificField: mandatoryField,
            errorMessage: translate('generic.validation.missing_fields'),
          };
        })
    );

    return errors;
  }

  private materialNumberCheck(demandValidationBatch: GridBatchUpload) {
    const errors: ErrorMessage<GridBatchUpload>[] = [];
    if (
      demandValidationBatch.materialNumber &&
      this.data.materialType === 'schaeffler'
    ) {
      const validationResult = validateMaterialNumber(
        demandValidationBatch.materialNumber.replaceAll('-', '')
      );

      if (validationResult) {
        this.errorRows.push(demandValidationBatch.id);

        errors.push({
          id: demandValidationBatch.id,
          dataIdentifier: { ...demandValidationBatch },
          specificField: 'materialNumber',
          errorMessage: validationResult.join('\n'),
        });
      }
    }

    return errors;
  }

  private forecastCheck(demandValidationBatch: GridBatchUpload) {
    const errors: ErrorMessage<GridBatchUpload>[] = [];

    Object.keys(demandValidationBatch).forEach((key) => {
      if (['id', 'materialNumber'].includes(key)) {
        return;
      }

      if (demandValidationBatch[key]) {
        const validationResult =
          ValidationHelper.detectLocaleAndValidateForLocalFloat(
            demandValidationBatch[key]
          );

        if (validationResult) {
          this.errorRows.push(demandValidationBatch.id);

          errors.push({
            id: demandValidationBatch.id,
            dataIdentifier: { ...demandValidationBatch },
            specificField: key,
            errorMessage: validationResult,
          });
        }
      }
    });

    return errors;
  }

  /**
   * Parses and formats a number based on localization settings for display within an AG-Grid cell.
   *
   * @private
   * @param {ValueFormatterParams} params
   * @return {string}
   * @memberof DemandValidationMultiGridEditComponent
   */
  private parseAndFormatNumber(params: ValueFormatterParams): string {
    return parseAndFormatNumber(params, this.agGridLocalizationService);
  }

  private getDemandData(data: GridBatchUpload[]): DemandValidationBatch[] {
    const batchData: DemandValidationBatch[] = [];

    data.forEach((uploadData) => {
      const kpiEntries: WriteKpiEntry[] = [];

      (this.kpiBuckets() || []).forEach((bucket) => {
        const date = parseISO(bucket.from);
        const dateString = this.keyFromDate(date);

        if (uploadData[dateString]) {
          kpiEntries.push({
            idx: this.getCellId(uploadData.id, uploadData, date),
            fromDate: format(dateString, 'yyyy-MM-dd'),
            bucketType: bucket.type,
            validatedForecast: strictlyParseLocalFloat(
              uploadData[dateString],
              ValidationHelper.getDecimalSeparatorForActiveLocale()
            ),
          });
        }
      });

      if (kpiEntries.length > 0) {
        batchData.push({
          id: uploadData.id,
          material: uploadData.materialNumber,
          dateString: null,
          forecast: null,
          periodType: null,
          kpiEntries,
        });
      }
    });

    return batchData;
  }

  /**
   * Returns an index for a specific cell.
   *
   * @private
   * @param {(string | undefined)} rowId
   * @param {*} data
   * @param {Date} date
   * @return {(number | undefined)}
   * @memberof DemandValidationMultiGridEditComponent
   */
  private getCellId(
    rowId: string | undefined,
    data: any,
    date: Date
  ): number | undefined {
    return rowId !== null && rowId !== undefined
      ? // eslint-disable-next-line unicorn/numeric-separators-style
        Number.parseInt(rowId, 10) * 100000 +
          Object.keys(data).indexOf(this.keyFromDate(date))
      : undefined;
  }
}
