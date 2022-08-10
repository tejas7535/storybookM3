/* eslint-disable max-lines */
import { Injectable } from '@angular/core';

import { ColDef } from 'ag-grid-enterprise';
import {
  ColumnUtilsService,
  filterParamsForDecimalValues,
  formatMaterialNumberFromString,
} from '@cdba/shared/components/table';
import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { ScrambleMaterialNumberPipe } from '@cdba/shared/pipes';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import { translate } from '@ngneat/transloco';

@Injectable()
export class ColumnDefinitionService {
  defaultCellClass = 'line-height-30';

  constructor(
    private readonly columnUtilsService: ColumnUtilsService,
    protected scrambleMaterialNumberPipe: ScrambleMaterialNumberPipe,
    private readonly betaFeatureService: BetaFeatureService
  ) {}

  DEFAULT_COL_DEF: ColDef = {
    sortable: true,
    resizable: true,
    cellClass: this.defaultCellClass,
  };

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

  // classic
  COLUMN_DEFINITIONS_CLASSIC: ColDef[] = [
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
    },
    {
      field: 'cycleTime',
      headerName: translate('shared.bom.headers.cycleTime'),
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

  // oData
  COLUMN_DEFINITIONS_ODATA: ColDef[] = [
    {
      field: 'level',
      headerName: translate('shared.bom.headers.level'),
      hide: true,
    },
    {
      field: 'costing.costAreaTotalValue',
      headerName: translate('shared.bom.headers.totalPricePerPc'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'costing.costAreaFixedCost',
      headerName: translate('shared.bom.headers.fixedCost'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.costAreaVariableCost',
      headerName: translate('shared.bom.headers.variableCost'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.costAreaCurrency',
      headerName: translate('shared.bom.headers.currency'),
    },
    {
      field: 'costing.companyCodeTotalValue',
      headerName: translate('shared.bom.headers.costObjectCurrency'),
      hide: true,
    },
    {
      field: 'costing.companyCodeFixedCost',
      headerName: translate('shared.bom.headers.fixedCostObjectCurrency'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.companyCodeVariableCost',
      headerName: translate('shared.bom.headers.variableCostObjectCurrency'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.companyCodeCurrency',
      headerName: translate('shared.bom.headers.objectCurrency'),
      hide: true,
    },
    {
      field: 'materialNumber',
      headerName: translate('shared.bom.headers.materialNumber'),
      valueGetter: (params) =>
        formatMaterialNumberFromString(params.data.materialNumber),
      valueFormatter: (params) =>
        this.scrambleMaterialNumberPipe.transform(params.value),
    },
    {
      field: 'procurement.plant',
      headerName: translate('shared.bom.headers.plant'),
    },
    {
      field: 'procurement.materialProcurementType',
      headerName: translate('shared.bom.headers.procurementType'),
    },
    {
      field: 'quantities.lotsize',
      headerName: translate('shared.bom.headers.lotsize'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          maximumFractionDigits: 0,
        }),
    },
    {
      field: 'quantities.lotsizeUnit',
      headerName: translate('shared.bom.headers.lotsizeUnit'),
      hide: true,
    },
    {
      field: 'quantities.quantity',
      headerName: translate('shared.bom.headers.quantityPerParent'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'quantities.baseUnitOfMeasure',
      headerName: translate('shared.bom.headers.unitOfMeasure'),
    },
    {
      field: 'materialCharacteristics.materialShortDescription',
      headerName: translate('shared.bom.headers.materialShortDescription'),
    },
    {
      field: 'materialCharacteristics.materialIndentNumberDescription',
      headerName: translate('shared.bom.headers.description'),
    },
    {
      field: 'materialCharacteristics.length',
      headerName: translate('shared.bom.headers.length'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'materialCharacteristics.width',
      headerName: translate('shared.bom.headers.width'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'materialCharacteristics.height',
      headerName: translate('shared.bom.headers.height'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'materialCharacteristics.unitOfDimension',
      headerName: translate('shared.bom.headers.unitOfDimension'),
    },
    {
      field: 'materialCharacteristics.grossWeight',
      headerName: translate('shared.bom.headers.grossWeight'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'materialCharacteristics.netWeight',
      headerName: translate('shared.bom.headers.netWeight'),
      filter: 'agNumberColumnFilter',
      filterParams: filterParamsForDecimalValues,
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    {
      field: 'materialCharacteristics.unitOfWeight',
      headerName: translate('shared.bom.headers.unitOfWeight'),
    },
    {
      field: 'materialCharacteristics.productHierarchy',
      headerName: translate('shared.bom.headers.productHierarchy'),
    },
    {
      field: 'materialCharacteristics.productHierarchyDescription',
      headerName: translate('shared.bom.headers.productHierarchyDescription'),
    },
    {
      field: 'manufacturing.staffSetupCosts',
      headerName: translate('shared.bom.headers.staffSetupCosts'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.staffProductionCosts',
      headerName: translate('shared.bom.headers.staffProductionCosts'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.machineSetupCosts',
      headerName: translate('shared.bom.headers.machineSetupCosts'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.machineProductionCosts',
      headerName: translate('shared.bom.headers.machineProductionCosts'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.toolCosts',
      headerName: translate('shared.bom.headers.toolCosts'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.cycleTime',
      headerName: translate('shared.bom.headers.cycleTime'),
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.additionalTimeMachine',
      headerName: translate('shared.bom.headers.additionalTimeMachine'),
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.cycles',
      headerName: translate('shared.bom.headers.cycles'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.cyclesUnit',
      headerName: translate('shared.bom.headers.cyclesUnit'),
      hide: true,
    },
    {
      field: 'manufacturing.totalProductionTime',
      headerName: translate('shared.bom.headers.totalProductionTime'),
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.setupTime',
      headerName: translate('shared.bom.headers.setupTime'),
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.standardValueUnit',
      headerName: translate('shared.bom.headers.standardValueUnit'),
    },
    {
      field: 'manufacturing.headcountProduction',
      headerName: translate('shared.bom.headers.headcountProduction'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.headcountSetup',
      headerName: translate('shared.bom.headers.headcountSetup'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.staffTariff',
      headerName: translate('shared.bom.headers.staffTariff'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.machineTariff',
      headerName: translate('shared.bom.headers.machineTariff'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.toolTariff',
      headerName: translate('shared.bom.headers.toolTariff'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
    },
    {
      field: 'manufacturing.tariffUnit',
      headerName: translate('shared.bom.headers.tariffUnit'),
    },
    {
      field: 'quantities.assemblyScrapQuantity',
      headerName: translate('shared.bom.headers.assemblyScrapQuantity'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      field: 'quantities.componentScrapQuantity',
      headerName: translate('shared.bom.headers.componentScrapQuantity'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      field: 'workCenter.capacityUtilizationRate',
      headerName: translate('shared.bom.headers.capacityUtilizationRate'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      hide: true,
    },
    {
      field: 'workCenter.replacementValue',
      headerName: translate('shared.bom.headers.replacementValue'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          maximumFractionDigits: 0,
        }),
      hide: true,
    },
    {
      field: 'workCenter.workCenterDescription',
      headerName: translate('shared.bom.headers.workCenterDescription'),
      hide: true,
    },
    {
      field: 'workCenter.workCenter',
      headerName: translate('shared.bom.headers.workCenter'),
    },
    {
      field: 'workCenter.costCenter',
      headerName: translate('shared.bom.headers.costCenter'),
      hide: true,
    },
    {
      field: 'workCenter.costCenterDescription',
      headerName: translate('shared.bom.headers.costCenterDescription'),
      hide: true,
    },
    {
      field: 'workCenter.profitCenter',
      headerName: translate('shared.bom.headers.profitCenter'),
      hide: true,
    },
    {
      field: 'procurement.vendorDescription',
      headerName: translate('shared.bom.headers.vendorDescription'),
    },
    {
      field: 'procurement.vendor',
      headerName: translate('shared.bom.headers.vendor'),
      hide: true,
    },
    {
      field: 'costing.costElements',
      headerName: translate('shared.bom.headers.costElements'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          maximumFractionDigits: 0,
        }),
      hide: true,
    },
    {
      field: 'costing.costAreaTotalPrice',
      headerName: translate('shared.bom.headers.costAreaTotalPrice'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.costAreaFixedPrice',
      headerName: translate('shared.bom.headers.fixedPrice'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.costAreaVariablePrice',
      headerName: translate('shared.bom.headers.variablePrice'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.companyCodeTotalPrice',
      headerName: translate('shared.bom.headers.companyCodeTotalPrice'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.companyCodeFixedPrice',
      headerName: translate('shared.bom.headers.fixedPriceObjectCurrency'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.companyCodeVariablePrice',
      headerName: translate('shared.bom.headers.variablePriceObjectCurrency'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        }),
      hide: true,
    },
    {
      field: 'costing.costArea',
      headerName: translate('shared.bom.headers.costArea'),
      hide: true,
    },
    {
      field: 'quantities.materialBudgetYearRequirement',
      headerName: translate('shared.bom.headers.materialBudgetYearRequirement'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          maximumFractionDigits: 0,
        }),
      hide: true,
    },
    {
      field: 'quantities.materialAnnualDemandCount',
      headerName: translate('shared.bom.headers.materialAnnualDemandCount'),
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          maximumFractionDigits: 0,
        }),
      hide: true,
    },
    {
      field: 'materialCharacteristics.valuationClass',
      headerName: translate('shared.bom.headers.materialValuationClass'),
      hide: true,
    },
    {
      field: 'materialCharacteristics.materialIndentNumber',
      headerName: translate('shared.bom.headers.materialIndentNumber'),
      hide: true,
    },
    {
      field: 'bomInformation.productCostingGroup',
      headerName: translate('shared.bom.headers.productCostingGroup'),
      hide: true,
    },
    {
      field: 'bomInformation.productCostingPlanCounter',
      headerName: translate('shared.bom.headers.productCostingPlanCounter'),
      hide: true,
    },
    {
      field: 'bomInformation.productCostingBomNumber',
      headerName: translate('shared.bom.headers.productCostingBomNumber'),
      hide: true,
    },
    {
      field: 'bomInformation.productCostingBomUsage',
      headerName: translate('shared.bom.headers.productCostingBomUsage'),
      hide: true,
    },
    {
      field: 'bomInformation.productCostingBomAlternative',
      headerName: translate('shared.bom.headers.productCostingBomAlternative'),
      hide: true,
    },
  ];

  public getColDef(): ColDef[] {
    return this.betaFeatureService.getBetaFeature(BetaFeature.O_DATA)
      ? this.COLUMN_DEFINITIONS_ODATA
      : this.COLUMN_DEFINITIONS_CLASSIC;
  }
}
