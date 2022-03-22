import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import {
  ColumnUtilsService,
  formatMaterialNumberFromString,
} from '@cdba/shared/components/table';
import { ScrambleMaterialNumberPipe } from '@cdba/shared/pipes';
import { translate } from '@ngneat/transloco';

@Injectable()
export class ColumnDefinitionService {
  defaultCellClass = 'line-height-30';

  constructor(
    private readonly columnUtilsService: ColumnUtilsService,
    protected scrambleMaterialNumberPipe: ScrambleMaterialNumberPipe
  ) {}

  AUTO_GROUP_COLUMN_DEF: ColDef = {
    headerName: translate('shared.bom.headers.materialDesignation'),
    resizable: true,
    minWidth: 300,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: 'bomMaterialDesignationCellRenderComponent',
      suppressDoubleClickExpand: true,
    },
  };

  DEFAULT_COL_DEF: ColDef = {
    sortable: true,
    resizable: true,
    cellClass: this.defaultCellClass,
  };

  COLUMN_DEFINITIONS_DEFAULT: ColDef[] = [
    {
      field: 'level',
      headerName: translate('shared.bom.headers.level'),
      hide: true,
    },
    {
      field: 'totalPricePerPc',
      headerName: translate('shared.bom.headers.totalPricePerPc'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'currency',
      headerName: translate('shared.bom.headers.currency'),
    },
    {
      field: 'materialNumber',
      headerName: translate('shared.bom.headers.materialNumber'),
      valueGetter: (params) =>
        formatMaterialNumberFromString(params.data.materialNumber),
      valueFormatter: (params) =>
        this.scrambleMaterialNumberPipe.transform(params.value),
      cellClass: ['stringType', this.defaultCellClass],
    },
    {
      field: 'plant',
      headerName: translate('shared.bom.headers.plant'),
    },
    {
      field: 'lotsize',
      headerName: translate('shared.bom.headers.lotsize'),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'setupTime',
      headerName: translate('shared.bom.headers.setupTime'),
      cellClass: ['floatingNumberType', this.defaultCellClass],
    },
    {
      field: 'cycleTime',
      headerName: translate('shared.bom.headers.cycleTime'),
      cellClass: ['floatingNumberType', this.defaultCellClass],
    },
    {
      field: 'toolingFactor',
      headerName: translate('shared.bom.headers.toolingFactor'),
    },
    {
      field: 'quantityPerParent',
      headerName: translate('shared.bom.headers.quantityPerParent'),
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'unitOfMeasure',
      headerName: translate('shared.bom.headers.unitOfMeasure'),
    },
    {
      field: 'costCenter',
      headerName: translate('shared.bom.headers.workCenter'),
    },
  ];
}
