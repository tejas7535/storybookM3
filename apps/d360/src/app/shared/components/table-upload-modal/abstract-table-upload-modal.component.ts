/* eslint-disable max-lines */
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  IRowNode,
  ProcessDataFromClipboardParams,
} from 'ag-grid-enterprise';

import { ErrorMessage } from '../../../pages/alert-rules/table/components/modals/alert-rule-logic-helper';
import { gridParseFromClipboard } from '../../ag-grid/grid-parse-from-clipboard';
import { ensureEmptyRowAtBottom, resetGrid } from '../../ag-grid/grid-utils';
import { AgGridLocalizationService } from '../../services/ag-grid-localization.service';
import { transparent } from '../../styles/colors';
import {
  multiPostResultsToUserMessages,
  PostResult,
  ResponseWithResultMessage,
} from '../../utils/error-handling';
import { getErrorMessage } from '../../utils/errors';
import { combineParseFunctionsForFields } from '../../utils/parse-values';
import { SnackbarService } from '../../utils/service/snackbar.service';
import { DeleteButtonCellRendererComponent } from '../ag-grid/cell-renderer/delete-button-cell-renderer/delete-button-cell-renderer.component';
import {
  buildValidationProps,
  rowIsEmpty,
} from '../ag-grid/validatation-functions';
import { ColumnForUploadTable } from './models';

/**
 * The AbstractTableUploadModal Component.
 *
 * Used to wrap all shared logic for all table upload modals
 *
 * @export
 * @abstract
 * @class AbstractTableUploadModalComponent
 * @implements {OnInit}
 * @template T
 * @template R
 */
@Component({
  template: '',
  standalone: false,
})
export abstract class AbstractTableUploadModalComponent<
  T,
  R extends ResponseWithResultMessage,
> implements OnInit
{
  /**
   * The snackbar instance.
   *
   * @private
   * @type {SnackbarService}
   * @memberof AbstractTableUploadModalComponent
   */
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  /**
   * The AgGridLocalizationService instance.
   *
   * @protected
   * @type {AgGridLocalizationService}
   * @memberof AbstractTableUploadModalComponent
   */
  protected readonly agGridLocalizationService: AgGridLocalizationService =
    inject(AgGridLocalizationService);

  /**
   * The AlertRulesService instance.
   *
   * @protected
   * @type {MatDialogRef<AbstractTableUploadModalComponent<T, R>>}
   * @memberof AbstractTableUploadModalComponent
   */
  protected dialogRef: MatDialogRef<AbstractTableUploadModalComponent<T, R>> =
    inject(MatDialogRef<AbstractTableUploadModalComponent<T, R>>);

  /**
   * The DestroyRef instance.
   *
   * @protected
   * @type {DestroyRef}
   * @memberof AbstractTableUploadModalComponent
   */
  protected readonly destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * The loading indicator signal.
   *
   * @protected
   * @type {WritableSignal<boolean>}
   * @memberof AbstractTableUploadModalComponent
   */
  protected readonly loading: WritableSignal<boolean> = signal(false);

  /**
   * The errors during the save / delete call.
   *
   * @protected
   * @type {WritableSignal<ErrorMessage<T>[]>}
   * @memberof AbstractTableUploadModalComponent
   */
  protected readonly backendErrors: WritableSignal<ErrorMessage<T>[]> = signal(
    []
  );

  /**
   * The errors during the frontend validation.
   *
   * @protected
   * @type {WritableSignal<ErrorMessage<T>[]>}
   * @memberof AbstractTableUploadModalComponent
   */
  protected readonly frontendErrors: WritableSignal<ErrorMessage<T>[]> = signal(
    []
  );

  /**
   * The grid api instance.
   *
   * @private
   * @type {(WritableSignal<GridApi | null>)}
   * @memberof AbstractTableUploadModalComponent
   */
  private readonly gridApi: WritableSignal<GridApi | null> = signal(null);

  /**
   * The default column definitions.
   *
   * @protected
   * @type {ColDef}
   * @memberof AbstractTableUploadModalComponent
   */
  protected defaultColDef: ColDef = {
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  };

  /**
   * An optional description text, rendered above the table
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected description = '';

  /**
   * The dialog title
   *
   * @protected
   * @abstract
   * @type {string}
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract title: string;

  /**
   * The modal mode.
   * Used to render save / delete buttons
   *
   * @protected
   * @abstract
   * @type {('save' | 'delete')}
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract modalMode: 'save' | 'delete';

  /**
   * The applyFunction triggered after clicking save or delete
   *
   * @protected
   * @abstract
   * @param {T[]} data
   * @param {boolean} dryRun
   * @return {Promise<PostResult<R>>}
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract applyFunction(
    data: T[],
    dryRun: boolean
  ): Promise<PostResult<R>>;

  /**
   *
   * Parse the existing Errors from a given PostResult.
   */
  protected abstract parseErrorsFromResult(
    result: PostResult<R>
  ): ErrorMessage<T>[];

  /**
   * The columnDefinitions used in this modal.
   *
   * @protected
   * @abstract
   * @type {ColumnForUploadTable<T>[]}
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract columnDefinitions: ColumnForUploadTable<T>[];

  /**
   * This method checks in the data for existing errors.
   *
   * @protected
   * @abstract
   * @param {T[]} data
   * @return {ErrorMessage<T>[]}
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract checkDataForErrors(data: T[]): ErrorMessage<T>[];

  /**
   * This parse functions are used in the clipboard paste event.
   *
   * @protected
   * @abstract
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract specialParseFunctionsForFields: Map<
    keyof T,
    (value: string) => string
  >;

  /**
   * The max allowed Rows for the table.
   *
   * @protected
   * @abstract
   * @type {number}
   * @memberof AbstractTableUploadModalComponent
   */
  protected abstract maxRows: number;

  /**
   * The onAdded callback.
   * Hint: override it, if you need a different behavior.
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected onAdded(): void {
    this.onClose();
  }

  /**
   * Indicator, if we have changed data.
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected hasChangedData = false;

  /**
   * The onClose callback.
   * Hint: override it, if you need a different behavior.
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected onClose(): void {
    this.dialogRef.close(this.hasChangedData);
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    this.updateColumnDefinitions();
  }

  /**
   * Update the column definitions of our AG Grid.
   *
   * We manually trigger this function to also update the cell styles (e.g. show a red cell because of a validation error)
   * of the grid from outside by calling the this.validateFunctionWithErrors function.
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected updateColumnDefinitions(): void {
    this.gridApi()?.setGridOption('columnDefs', [
      ...this.columnDefinitions.map(
        (colDef: ColumnForUploadTable<T>) =>
          ({
            ...colDef,
            field: colDef.field.toString(),
            minWidth: colDef.minWidth ?? 200,
            validationFn: undefined,
            ...buildValidationProps(
              this.validateFunctionWithErrors(colDef.validationFn),
              true,
              colDef?.bgColorFn ? colDef.bgColorFn() : transparent
            ),
          }) as ColumnForUploadTable<T>
      ),
      {
        field: 'DELETE',
        headerName: '',
        cellRenderer: DeleteButtonCellRendererComponent,
        minWidth: 68,
        maxWidth: 68,
      },
    ] as ColDef[]);
  }

  /**
   * Validate the values and set errors.
   *
   * @private
   * @param {((value: string, rowData: IRowNode) => string | null | undefined)} [valFn]
   * @return
   * @memberof AbstractTableUploadModalComponent
   */
  private validateFunctionWithErrors(
    valFn?: (value: string, rowData: IRowNode) => string | null | undefined
  ) {
    return (
      value: string,
      rowData: IRowNode,
      colId?: string
    ): string | null | undefined => {
      if (valFn && value) {
        const validationResult = valFn(value, rowData);
        if (validationResult) {
          return validationResult;
        }
        // else {
        //   FIXME: Temporary fix. (PART 2) => Ticket: SFT-1999
        //   Delete the FE error from this.frontendErrors(), after we have a rowId and SAP is also using this id.
        // }
      }

      const allErrorMessages = [
        ...this.backendErrors(),
        ...this.frontendErrors(),
      ];
      if (allErrorMessages.length === 0) {
        return undefined;
      }

      const typed: T = this.getTypedRowData(rowData);

      let matchingErrors = allErrorMessages.filter((errMsg) =>
        this.isPartialDataMatching(errMsg.dataIdentifier, typed)
      );

      // parse Errors by ID
      if (matchingErrors.length === 0) {
        // TODO: parse errors by idx for detect errors in fields
        matchingErrors = allErrorMessages.filter(
          (errMsg) =>
            errMsg.id !== undefined &&
            (typed as any).id !== undefined &&
            errMsg.id === (typed as any).id
        );

        if (matchingErrors.length === 0) {
          return undefined;
        }
      }

      const fieldError = matchingErrors.find(
        (errMsg) => errMsg.specificField === colId
      );
      if (fieldError) {
        return fieldError.errorMessage;
      }

      const rowError = matchingErrors.find(
        (errMsg) => !errMsg.specificField || !colId
      );

      return rowError?.errorMessage || null;
    };
  }

  /**
   * This method is triggered after clicking save or delete.
   *
   * @protected
   * @param {boolean} dryRun
   * @return
   * @memberof AbstractTableUploadModalComponent
   */
  protected async onApplyData(dryRun: boolean) {
    this.backendErrors.set([]);
    this.frontendErrors.set([]);

    const data: T[] = this.dataFromRowModel();

    if (this.checkForNoRows(data) || this.checkForTooManyRows()) {
      return;
    }

    this.loading.set(true);
    const action = dryRun ? 'check' : 'save';

    try {
      const errorsFromValidation = this.getValidationErrors(
        this.columnDefinitions
      );
      const errorsFromDataCheck = this.checkDataForErrors(data);
      this.frontendErrors.set(errorsFromDataCheck);

      const allErrorsFromValidations = [
        ...errorsFromValidation,
        ...errorsFromDataCheck,
      ];

      const validData = data.filter(
        (row) =>
          !allErrorsFromValidations.some((error) =>
            this.isPartialDataMatching(error.dataIdentifier, row)
          )
      );

      const errorRowCount = this.countErrorRows(allErrorsFromValidations);

      if (validData.length === 0) {
        if (this.frontendErrors().length > 0) {
          this.updateColumnDefinitions();
        }

        this.snackbarService.openSnackBar(
          this.getErrorMessageFn(action)(errorRowCount)
        );

        return;
      }

      const postResult = await this.applyFunction(validData, dryRun);

      // we set hasChangedData to true, if we have changed data.
      this.hasChangedData =
        this.hasChangedData ||
        postResult.response.some(
          (response) => response?.result?.messageType === 'SUCCESS'
        );

      // Set error messages to show them in grid
      this.backendErrors.set(this.parseErrorsFromResult(postResult));

      // render error hints and remove potentially fixed error hints from cells
      this.updateColumnDefinitions();

      // TODO: add a generic way to parse ID and IDX in Error Messages.
      const userMessages = multiPostResultsToUserMessages(
        postResult,
        this.getSuccessMessageFn(action),
        this.getErrorMessageFn(action),
        this.getErrorMessageFn(action),
        errorRowCount
      );

      userMessages.forEach((msg) =>
        this.snackbarService.openSnackBar(msg.message)
      );

      if (
        userMessages.length === 1 &&
        (userMessages[0].variant === 'success' ||
          userMessages[0].variant === 'warning') &&
        !dryRun
      ) {
        this.onAdded();
      }
    } catch (error: unknown) {
      this.snackbarService.openSnackBar(
        translate('generic.validation.upload.upload_failed', {
          reason: getErrorMessage(error),
        })
      );
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Returns the data in a row model.
   *
   * @private
   * @return {T[]}
   * @memberof AbstractTableUploadModalComponent
   */
  private dataFromRowModel(): T[] {
    const rowData: T[] = [];
    this.gridApi().forEachNode((row) => {
      if (rowIsEmpty(row)) {
        return;
      }

      rowData.push(this.getTypedRowData(row));
    });

    return rowData;
  }

  /**
   * Get a single row for the given data format.
   *
   * @private
   * @param {RowNode} rowNode
   * @return {T}
   * @memberof AbstractTableUploadModalComponent
   */
  protected getTypedRowData(rowNode: IRowNode): T {
    return rowNode.data as T;
  }

  /**
   * Checks for no rows in the table
   *
   * @private
   * @param {T[]} data
   * @return {boolean}
   * @memberof AbstractTableUploadModalComponent
   */
  private checkForNoRows(data: T[]): boolean {
    // Check the data not the rows because rows can be empty
    if (data.length === 0) {
      this.snackbarService.openSnackBar(
        translate('generic.validation.upload.no_entries', {})
      );

      return true;
    }

    return false;
  }

  /**
   * Checks for too many rows in the table.
   *
   * @private
   * @param {number} [maxAllowedRows=200]
   * @return {boolean}
   * @memberof AbstractTableUploadModalComponent
   */
  private checkForTooManyRows(): boolean {
    // More than max rows (@see this.maxRows) are not allowed because we would wait to long,
    // one row is always empty at the end.
    if (this.gridApi()?.getDisplayedRowCount() > this.maxRows + 1) {
      this.snackbarService.openSnackBar(
        translate('generic.validation.upload.too_many_entries', {
          maxRows: this.maxRows,
        })
      );

      return true;
    }

    return false;
  }

  /**
   * Returns the validation errors in a row.
   *
   * @private
   * @param {ColumnForUploadTable<T>[]} columnDefinitions
   * @return {ErrorMessage<T>[]}
   * @memberof AbstractTableUploadModalComponent
   */
  private getValidationErrors(
    columnDefinitions: ColumnForUploadTable<T>[]
  ): ErrorMessage<T>[] {
    const errors: ErrorMessage<T>[] = [];

    columnDefinitions.forEach((def) => {
      const { validationFn, field } = def;

      if (validationFn) {
        this.gridApi()?.forEachNode((row) => {
          const data = row.data;

          if (field && data[field]) {
            const errorMessage = validationFn(data[field], row);
            if (errorMessage) {
              errors.push({
                id: row?.id,
                dataIdentifier: data,
                specificField: field,
                errorMessage,
              });
            }
          }
        });
      }
    });

    return errors;
  }

  /**
   * This method counts and returns the error rows.
   * (2 or more errors in a row results in one error)
   *
   * @private
   * @param {ErrorMessage<T>[]} errors
   * @return {number}
   * @memberof AbstractTableUploadModalComponent
   */
  private countErrorRows(errors: ErrorMessage<T>[]): number {
    const uniqueRowIdentifiers = new Set<Partial<T>>();
    for (const error of errors) {
      if (
        ![...uniqueRowIdentifiers].some((rowIdentifier) =>
          this.isPartialDataMatching(rowIdentifier, error.dataIdentifier)
        )
      ) {
        uniqueRowIdentifiers.add(error.dataIdentifier);
      }
    }

    return uniqueRowIdentifiers.size;
  }

  /**
   * Returns a new function to translate error messages including a count.
   *
   * @protected
   * @param {('save' | 'check')} action
   * @return
   * @memberof AbstractTableUploadModalComponent
   */
  protected getErrorMessageFn(action: 'save' | 'check') {
    return (count: number) =>
      translate(`generic.validation.upload.${action}.error`, { count });
  }

  /**
   * Returns a new function to translate success messages including a count.
   *
   * @protected
   * @param {('save' | 'check')} action
   * @return
   * @memberof AbstractTableUploadModalComponent
   */
  protected getSuccessMessageFn(action: 'save' | 'check') {
    return (count: number) =>
      translate(`generic.validation.upload.${action}.success`, { count });
  }

  /**
   * The AG-Grid onGridReady callback.
   *
   * @protected
   * @param {GridReadyEvent} event
   * @memberof AbstractTableUploadModalComponent
   */
  protected onGridReady(event: GridReadyEvent) {
    this.gridApi.set(event.api);
    this.updateColumnDefinitions();
    event.api.applyTransaction({ add: [{}] });
    event.api.sizeColumnsToFit();
  }

  /**
   * The AG-Grid onGridSizeChanged callback.
   *
   * @protected
   * @param {GridSizeChangedEvent} event
   * @memberof AbstractTableUploadModalComponent
   */
  protected onGridSizeChanged(event: GridSizeChangedEvent) {
    event.api.sizeColumnsToFit();
  }

  /**
   * The AG-Grid onClipboard callback.
   *
   * @protected
   * @param {ProcessDataFromClipboardParams<T>} params
   * @return {null}
   * @memberof AbstractTableUploadModalComponent
   */
  protected onClipboard(params: ProcessDataFromClipboardParams<T>): null {
    gridParseFromClipboard(
      this.gridApi(),
      params.data,
      combineParseFunctionsForFields(this.specialParseFunctionsForFields)
    );

    // FIXME: Temporary fix. (PART 1) => Ticket: SFT-1999
    // We disabled the live error validation for now, because we can't match the FE-Errors to BE-Errors in a later step.
    // This happens because of 2 things:
    // 1. SAP does not get all data (only the ones without FE-Errors)
    // 2. We do not add a rowId to each error, so if one error occurs to a field all combinations to that field will have this error.
    //    So, it's not possible to delete this error, after a correct value was entered.

    // this.frontendErrors.set(
    //   this.checkDataForErrors(this.dataFromRowModel(rowModel))
    // );

    // TODO: After or together with SFT-1999 we should also discuss, if we show directly the errors instead of waiting until
    // the user clicks save or validate
    // if (this.frontendErrors().length > 0) {
    //   this.updateColumnDefinitions();
    // }

    return null;
  }

  /**
   * Add a new empty row to the table.
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected addEmptyRow(): void {
    if (this.gridApi()) {
      ensureEmptyRowAtBottom(this.gridApi());
    }
  }

  /**
   * The onReset callback, triggered after clicking on reset.
   *
   * @protected
   * @memberof AbstractTableUploadModalComponent
   */
  protected onReset(): void {
    this.backendErrors.set([]);
    this.frontendErrors.set([]);
    resetGrid(this.gridApi());
  }

  /**
   * This method checks, if the data have a partial matching.
   *
   * @private
   * @template DATA
   * @param {Partial<DATA>} dataIdentifier
   * @param {*} data
   * @return {boolean}
   * @memberof AbstractTableUploadModalComponent
   */
  private isPartialDataMatching<DATA>(
    dataIdentifier: Partial<DATA>,
    data: any
  ): boolean {
    const propertiesIdentifier = Object.entries(dataIdentifier);

    for (const [fieldName, fieldValue] of propertiesIdentifier) {
      // SAP sends back empty strings for empty fields but agGrid just leaves the field out. So don't use it.
      if (!fieldValue || fieldValue === '') {
        continue;
      }

      // Use a single check for all conditions
      if (
        !(
          fieldName in data &&
          data[fieldName] !== undefined &&
          (data[fieldName] ?? '').toString().replaceAll('-', '') ===
            fieldValue.toString().replaceAll('-', '')
        )
      ) {
        return false;
      }
    }

    return true;
  }
}
