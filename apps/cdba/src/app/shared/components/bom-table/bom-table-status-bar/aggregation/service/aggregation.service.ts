import { Injectable } from '@angular/core';

import { CellRange, GridApi, IRowNode } from 'ag-grid-community';

import { AggregationStatusBar } from '@cdba/shared/models';
import { AggregationStatusBarData } from '@cdba/shared/models/aggregation-status-bar.model';

@Injectable()
export class AggregationService {
  calculateStatusBarValues(
    aggregationModel: AggregationStatusBar,
    cellRanges: CellRange[],
    api: GridApi
  ): AggregationStatusBar {
    if (!cellRanges || cellRanges.length === 0) {
      return this.resetModel(aggregationModel);
    }

    aggregationModel.data = this.extractSelectedCells(cellRanges, api);

    return this.calculateModel(aggregationModel);
  }

  private calculateModel(
    aggregationModel: AggregationStatusBar
  ): AggregationStatusBar {
    let containsNumberCells = false;
    let containsStringCells = false;
    let count = 0;

    if (aggregationModel.data.numberCells.size >= 2) {
      let sum = 0;
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      let average = 0;
      const precision = 4;

      aggregationModel.data.numberCells.forEach((value: number) => {
        if (value < min) {
          min = value;
        }
        if (value > max) {
          max = value;
        }
        count += 1;

        sum += value;
      });

      average = sum / count;

      aggregationModel.average = this.roundUp(average, precision);
      aggregationModel.max = this.roundUp(max, precision);
      aggregationModel.min = this.roundUp(min, precision);
      aggregationModel.sum = this.roundUp(sum, precision);
      containsNumberCells = true;
    } else {
      containsNumberCells = false;
    }
    if (aggregationModel.data.stringCells.size > 0) {
      aggregationModel.data.stringCells.forEach(() => {
        count += 1;
      });
    }
    aggregationModel.count = count;

    containsStringCells = aggregationModel.data.stringCells.size >= 2;

    aggregationModel.isVisible =
      containsNumberCells || containsStringCells ? true : false;

    aggregationModel.showFullModel =
      containsStringCells && !containsNumberCells ? false : true;

    return aggregationModel;
  }

  private extractSelectedCells(
    cellRanges: CellRange[],
    api: GridApi
  ): AggregationStatusBarData {
    const numberCells: Map<string, number> = new Map();
    const stringCells: Map<string, string> = new Map();

    cellRanges.forEach((cellRange) => {
      let cellValue: any;
      let rowNode: IRowNode;

      const rowStartIndex = Math.min(
        cellRange.startRow.rowIndex,
        cellRange.endRow.rowIndex
      );
      const rowEndIndex = Math.max(
        cellRange.startRow.rowIndex,
        cellRange.endRow.rowIndex
      );

      for (let i = rowStartIndex; i <= rowEndIndex; i += 1) {
        cellRange.columns.forEach((column) => {
          rowNode = api.getDisplayedRowAtIndex(i);
          cellValue = api.getCellValue({ rowNode, colKey: column });
          if (typeof cellValue === 'number' && !Number.isNaN(cellValue)) {
            numberCells.set(
              `${column.getId()}_r${rowNode.rowIndex}`,
              cellValue
            );
          } else if (
            typeof cellValue === 'string' &&
            cellValue.trim().length > 0
          ) {
            stringCells.set(
              `${column.getId()}_r${rowNode.rowIndex}`,
              cellValue
            );
          }
        });
      }
    });

    return new AggregationStatusBarData(numberCells, stringCells);
  }

  private resetModel(
    aggregationModel: AggregationStatusBar
  ): AggregationStatusBar {
    aggregationModel.data = new AggregationStatusBarData(new Map(), new Map());
    aggregationModel.average = 0;
    aggregationModel.count = 0;
    aggregationModel.max = 0;
    aggregationModel.min = 0;
    aggregationModel.sum = 0;
    aggregationModel.isVisible = false;
    aggregationModel.showFullModel = false;

    return aggregationModel;
  }

  private roundUp(num: number, precision: number) {
    const prec: number = Math.pow(10, precision);

    return Math.ceil(num * prec) / prec;
  }
}
