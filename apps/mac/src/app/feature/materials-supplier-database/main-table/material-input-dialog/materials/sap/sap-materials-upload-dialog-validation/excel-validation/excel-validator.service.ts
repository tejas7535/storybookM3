import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator } from '@angular/forms';

import { from, Observable } from 'rxjs';

import { translate } from '@ngneat/transloco';
import * as XLSX from 'xlsx';

import {
  DIRECT_SUPPLIER_EMISSIONS,
  EMISSION_FACTOR_KG,
  INDIRECT_SUPPLIER_EMISSIONS,
  MATERIAL_UTILIZATION_FACTOR,
  UPSTREAM_EMISSIONS,
} from '@mac/feature/materials-supplier-database/constants';

import {
  COLUMN_HEADER_FIELD,
  COLUMN_RULES,
  ErrorCode,
  MANDATORY_COLUMNS,
  ValidationError,
} from './excel-validator-config';

@Injectable()
export class ExcelValidatorService implements AsyncValidator {
  private columnHeaderFormattedToDataField: {
    [columnHeader: string]: string;
  };

  private dataFieldToColumnHeader: {
    [dataField: string]: string;
  };

  private readonly EXCEL_DATA_ROW_START = 3; // 1 + 1 + 1, exclude header and hint row and display the physical row number, not index-based

  constructor() {
    this.initMappings();
  }

  validate(control: AbstractControl<File>): Observable<any | null> {
    return from(this.handleFileAsync(control.value));
  }

  private async handleFileAsync(file: File): Promise<any> {
    const data = await file.arrayBuffer();
    const wb: XLSX.WorkBook = XLSX.read(data);
    const columnHeaders = XLSX.utils.sheet_to_json(
      wb.Sheets[wb.SheetNames[0]],
      { header: 1 }
    )[0] as string[];
    const wbJson = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const dataObjects = this.mapExcelJsonList(wbJson);

    // validation methods:
    try {
      this.validateColumns(columnHeaders);
      this.checkForMissingValues(dataObjects);
      this.validateValues(dataObjects);
      this.validatePcfValues(dataObjects);
      this.validateMaterialUtilizationFactor(dataObjects);
      this.validatePcfSupplierEmissions(dataObjects);
    } catch (error) {
      const valEr: ValidationError = error as ValidationError;

      return { [valEr.errorCode]: true, params: valEr.params };
    }

    return undefined;
  }

  /**
   * Map the given Excel JSON objects list, so that the objects have the correct data field name and not the header label as a key/field name.
   *
   * @param excelJsonList List of Excel JSON objects with key: column header label and value: cell value
   * @returns mapped JSON objects with the correct data fields names
   */
  private mapExcelJsonList(excelJsonList: any[]): any[] {
    const excelJsonListCopy: any[] = JSON.parse(JSON.stringify(excelJsonList));
    // Remove the first object, representing the hints row in the Excel file
    excelJsonListCopy.shift();

    return excelJsonListCopy.map((excelJson) => this.mapExcelJson(excelJson));
  }

  /**
   * Map the given Excel JSON to a JSON object with the correct data fields names, defined in the ColumnsHeaderToDataFieldMapping
   *
   * @param excelJson JSON object, delivered from the XLSX lib
   * @returns mapped JSON object with the correct data fields names
   */
  private mapExcelJson(excelJson: any): any {
    const newExcelJson: any = {};

    for (const [key, value] of Object.entries(excelJson)) {
      newExcelJson[
        this.columnHeaderFormattedToDataField[this.formatHeaderLabel(key)]
      ] = value;
    }

    return newExcelJson;
  }

  private initMappings(): void {
    this.columnHeaderFormattedToDataField = {};
    this.dataFieldToColumnHeader = {};

    COLUMN_HEADER_FIELD.map((dataField) => ({
      dataField,
      columnHeader: translate(
        `materialsSupplierDatabase.mainTable.columns.${dataField}`
      ),
    })).forEach(({ dataField, columnHeader }) => {
      this.columnHeaderFormattedToDataField[
        this.formatHeaderLabel(columnHeader)
      ] = dataField;
      this.dataFieldToColumnHeader[dataField] = columnHeader;
    });
  }

  /**
   * Remove mandatory column sign and all whitespaces from the given column header label and transform it to lower case
   *
   * @param headerLabel column header label to be formatted
   * @return formatted column header label
   */
  private formatHeaderLabel(headerLabel: string): string {
    return headerLabel.replace('(*)', '').replaceAll(/\s/g, '').toLowerCase();
  }

  private validateColumns(columnHeaders: string[]) {
    // map list of columns in excel to data fields
    const excelColumns = new Set(
      columnHeaders.map(
        (excelColumn: string) =>
          this.columnHeaderFormattedToDataField[
            this.formatHeaderLabel(excelColumn)
          ]
      )
    );

    // check if mandatory columns are present
    const missingColumns = MANDATORY_COLUMNS.filter(
      (column) => !excelColumns.has(column)
    );

    if (missingColumns.length > 0) {
      throw new ValidationError(ErrorCode.MISSING_MANDATORY_COLUMN, {
        missing: missingColumns
          .map(
            (missingColumn: string) =>
              this.dataFieldToColumnHeader[missingColumn]
          )
          .join(', '),
      });
    }
  }

  private checkForMissingValues(json: any[]) {
    json.forEach((row: any, rowIndex: number) => {
      const keys = Object.keys(row);
      const missingColumns = MANDATORY_COLUMNS.filter(
        (mandatoryColumn) => !keys.includes(mandatoryColumn)
      );

      if (missingColumns.length > 0) {
        throw new ValidationError(ErrorCode.MISSING_MANDATORY_VALUE, {
          column: missingColumns
            .map(
              (missingColumn: string) =>
                this.dataFieldToColumnHeader[missingColumn]
            )
            .join(', '),
          rowNumber: rowIndex + this.EXCEL_DATA_ROW_START,
        });
      }
    });
  }

  private validateValues(json: any[]) {
    // verify only 'valid' columns
    const keys = Object.keys(COLUMN_RULES);

    // check each data row
    json.forEach((row: any, rowIndex: number) => {
      keys.forEach((column) => {
        const value = row[column];
        const rule = COLUMN_RULES[column];

        // check only if value is set
        if ((value || value === 0) && !rule.test(value)) {
          throw new ValidationError(ErrorCode.INVALID_VALUE, {
            column: this.dataFieldToColumnHeader[column],
            value,
            rowNumber: rowIndex + this.EXCEL_DATA_ROW_START,
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
          rowNumber: rowIndex + this.EXCEL_DATA_ROW_START,
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
          rowNumber: rowIndex + this.EXCEL_DATA_ROW_START,
        });
      }
    });
  }

  private validateMaterialUtilizationFactor(json: any[]) {
    // check each data row
    json.forEach((row: any, rowIndex: number) => {
      const value = row.materialUtilizationFactor;

      // value needs to be numeric and less than or equals 1 if it is available
      if (
        value !== undefined &&
        (Number.isNaN(Number(value)) || value > 1 || value < 0)
      ) {
        throw new ValidationError(ErrorCode.INVALID_VALUE, {
          column: this.dataFieldToColumnHeader[MATERIAL_UTILIZATION_FACTOR],
          value,
          rowNumber: rowIndex + this.EXCEL_DATA_ROW_START,
        });
      }
    });
  }

  private validatePcfSupplierEmissions(json: any[]) {
    json.forEach((row: any, rowIndex: number) => {
      const emissionFactorKgValue = row[EMISSION_FACTOR_KG] || 0;
      const directSupplierEmissions = row[DIRECT_SUPPLIER_EMISSIONS];
      const indirectSupplierEmissions = row[INDIRECT_SUPPLIER_EMISSIONS];
      const upstreamEmissions = row[UPSTREAM_EMISSIONS];
      let pcfSupplierEmissions = 0;

      if (directSupplierEmissions) {
        pcfSupplierEmissions += directSupplierEmissions;
      }

      if (indirectSupplierEmissions) {
        pcfSupplierEmissions += indirectSupplierEmissions;
      }

      if (upstreamEmissions) {
        pcfSupplierEmissions += upstreamEmissions;
      }

      const exception = new ValidationError(
        ErrorCode.INVALID_PCF_SUPPLIER_EMISSIONS,
        {
          pcfSupplierEmissions,
          emissionFactorKg: row[EMISSION_FACTOR_KG] || 'undefined',
          rowNumber: rowIndex + this.EXCEL_DATA_ROW_START,
        }
      );

      if (
        directSupplierEmissions &&
        indirectSupplierEmissions &&
        upstreamEmissions
      ) {
        if (pcfSupplierEmissions !== emissionFactorKgValue) {
          throw exception;
        }
      } else if (
        (directSupplierEmissions ||
          indirectSupplierEmissions ||
          upstreamEmissions) &&
        pcfSupplierEmissions >= emissionFactorKgValue
      ) {
        throw exception;
      }
    });
  }
}
