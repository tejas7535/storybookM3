import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator } from '@angular/forms';

import { from, Observable } from 'rxjs';

import * as XLSX from 'xlsx';

import {
  COLUMN_RULES,
  ErrorCode,
  MANDATORY_COLUMNS,
  ValidationError,
} from './excel-validator-config';

@Injectable()
export class ExcelValidatorService implements AsyncValidator {
  validate(control: AbstractControl<File>): Observable<any | null> {
    return from(this.handleFileAsync(control.value));
  }

  private async handleFileAsync(file: File): Promise<any> {
    const data = await file.arrayBuffer();
    const wb: XLSX.WorkBook = XLSX.read(data);
    const wbJson = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    // validation methods:
    try {
      this.validateColumns(wbJson);
      this.validateValues(wbJson);
      this.validatePcfValues(wbJson);
    } catch (error) {
      const valEr: ValidationError = error as ValidationError;

      return { [valEr.errorCode]: true, params: valEr.params };
    }

    return undefined;
  }

  private validateColumns(json: any[]) {
    // get list of columns in excel file
    const excelColumns = Object.keys(json[0]);

    // check if mandatory columns are present
    const missingColumns = MANDATORY_COLUMNS.filter(
      (column) => !excelColumns.includes(column)
    );
    if (missingColumns.length > 0) {
      throw new ValidationError(ErrorCode.MISSING_MANDATORY_COLUMN, {
        missing: missingColumns.join(', '),
      });
    }
  }

  private validateValues(json: any[]) {
    // verify only 'valid' columns
    const keys = Object.keys(COLUMN_RULES);

    // check each data row
    json.forEach((row: any, rowIndex: number) => {
      keys.forEach((column) => {
        const value = row[column];
        const rule = COLUMN_RULES[column];

        // null is not allowed
        if (!value || !rule.test(value)) {
          throw new ValidationError(ErrorCode.INVALID_VALUE, {
            column,
            value,
            rowIndex,
          });
        }
      });
    });
  }

  private validatePcfValues(json: any[]) {
    // check each data row
    json.forEach((row: any, rowIndex: number) => {
      const valueKg = row.emissionFactorKg;
      const valuePc = row.emissionFactorPc;

      // at least one pcf value is required
      if (valueKg === undefined && valuePc === undefined) {
        throw new ValidationError(ErrorCode.NO_PCF_VALUE, {
          rowIndex,
        });
      }

      if (
        // value needs to be numeric if it is available
        (Number.isNaN(Number(valueKg)) && valueKg !== undefined) ||
        (Number.isNaN(Number(valuePc)) && valuePc !== undefined) ||
        // value needs to be above 0
        valueKg <= 0 ||
        valuePc <= 0
      ) {
        throw new ValidationError(ErrorCode.INVALID_PCF_VALUE, {
          valueKg,
          valuePc,
          rowIndex,
        });
      }
    });
  }
}
