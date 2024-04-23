import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-community';
import moment from 'moment';
import * as XLSX from 'xlsx';

import * as columns from '@mac/feature/materials-supplier-database/constants';

import {
  COLUMN_HEADER_FIELDS,
  MANDATORY_COLUMNS,
} from '../../main-table/material-input-dialog/materials/sap/sap-materials-upload-dialog-validation/excel-validation/excel-validator-config';
import { SAP_MATERIALS_COLUMN_DEFINITIONS } from '../../main-table/table-config/materials/sap-materials';
import { SAPMaterial } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class MsdSapMaterialsExcelService {
  private readonly DATE_FIELDS = [columns.VALID_FROM, columns.VALID_UNTIL];

  private readonly BOOLEAN_FIELDS = [
    columns.ONLY_RENEWABLE_ELECTRICITY,
    columns.CUSTOMER_CALCULATION_METHOD_APPLIED,
    columns.CALCULATION_METHOD_VERIFIED_BY_3RD_PARTY,
    columns.PCF_VERIFIED_BY_3RD_PARTY,
  ];

  private readonly PERCENT_FIELDS = [
    columns.RECYCLED_MATERIAL_SHARE,
    columns.SECONDARY_MATERIAL_SHARE,
    columns.FOSSIL_ENERGY_SHARE,
    columns.NUCLEAR_ENERGY_SHARE,
    columns.RENEWABLE_ENERGY_SHARE,
    columns.PRIMARY_DATA_SHARE,
  ];

  downloadRejectedSapMaterialsAsExcel(
    rejectedSapMaterials: SAPMaterial[]
  ): void {
    const headerCells = COLUMN_HEADER_FIELDS.map((field: string) =>
      this.translateKey('columns', field)
    );
    const hintsCells = this.buildHintsCells();
    const excelDataObjects = this.buildExcelData(rejectedSapMaterials);

    const workBook = XLSX.utils.book_new();
    const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(workSheet, [headerCells, hintsCells]);
    XLSX.utils.sheet_add_json(workSheet, excelDataObjects, {
      origin: 'A3',
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(
      workBook,
      workSheet,
      this.translateKey('rejectedExcelDownload', 'sheetName')
    );
    XLSX.writeFile(
      workBook,
      moment().format('YYYY-MM-DD') +
        this.translateKey('rejectedExcelDownload', 'matNrFileNameSuffix')
    );
  }

  private buildHintsCells(): string[] {
    return COLUMN_HEADER_FIELDS.map((field: string) => {
      const hintTranslationKeySuffix = SAP_MATERIALS_COLUMN_DEFINITIONS.find(
        (colDef: ColDef) => colDef.field === field
      )?.headerTooltip;
      const hint = hintTranslationKeySuffix
        ? this.translateKey('tooltip', hintTranslationKeySuffix)
        : undefined;
      const isMandatory = MANDATORY_COLUMNS.includes(field);
      const mandatoryTranslation = this.translateKey('tooltip', 'mandatory');

      if (isMandatory && hint) {
        return `${mandatoryTranslation} - ${hint}`;
      }

      return isMandatory ? mandatoryTranslation : hint;
    });
  }

  private buildExcelData(rejectedSapMaterials: SAPMaterial[]): any[] {
    return rejectedSapMaterials.map((rejectedSapMaterial: any) => {
      const dataObject: { [field: string]: any } = {};

      COLUMN_HEADER_FIELDS.forEach((field: string) => {
        let value = rejectedSapMaterial[field];

        if (this.DATE_FIELDS.includes(field)) {
          value = this.mapDateNumberToDate(rejectedSapMaterial[field]);
        } else if (this.BOOLEAN_FIELDS.includes(field)) {
          value = this.mapBooleanToString(rejectedSapMaterial[field]);
        } else if (this.PERCENT_FIELDS.includes(field)) {
          value = this.mapPercentToDecimal(rejectedSapMaterial[field]);
        }

        dataObject[field] = value;
      });

      return dataObject;
    });
  }

  private mapBooleanToString(booleanValue: boolean): string {
    switch (booleanValue) {
      case true: {
        return 'Yes';
      }
      case false: {
        return 'No';
      }
      default: {
        return undefined;
      }
    }
  }

  private mapDateNumberToDate(date: number): Date {
    if (date) {
      return new Date(date);
    }

    return undefined;
  }

  private mapPercentToDecimal(percentValue: number): number {
    if (percentValue !== undefined) {
      return percentValue / 100;
    }

    return undefined;
  }

  private translateKey(level: string, key: string) {
    const longKey = `materialsSupplierDatabase.mainTable.${level}.${key}`;
    const result = translate(longKey);

    return result === longKey ? undefined : result;
  }
}
