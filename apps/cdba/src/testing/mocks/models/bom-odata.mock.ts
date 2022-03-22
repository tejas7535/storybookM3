import { BomItemOdata } from '@cdba/shared/models/bom-item-odata.model';

// oData
export const BOM_ITEM_ODATA_MOCK: BomItemOdata = {
  rowId: 1,
  level: 1,
  materialDesignation: 'mock-materialDesignation',
  materialNumber: 'mock-materialNumber',
  parentMaterialNumber: 'mock-materialNumber',
  predecessorsInTree: [],

  bomIdentifier: {
    costingDate: '2017-11-01',
    costingNumber: 'mock-costingNumber',
    costingType: 'mock-costingType',
    version: 'mock-version',
    enteredManually: true,
    referenceObject: 'mock-referenceObject',
    valuationVariant: 'mock-valuationVariant',
  },

  bomInformation: {
    productCostingGroup: 'mock-productCostingGroup',
    productCostingPlanCounter: 'mock-productCostingPlanCounter',
    productCostingBomNumber: 'mock-productCostingBomNumber',
    productCostingBomUsage: 'mock-productCostingBomUsage',
    productCostingBomAlternative: 'mock-productCostingBomAlternative',
  },

  material: {
    length: 1234.567,
    width: 1234.567,
    height: 1234.567,
    unitOfDimension: 'mock-unitOfDimension',
    grossWeight: 1234.567,
    netWeight: 1234.567,
    unitOfWeight: 'mock-unitOfWeight',
    materialShortDescription: 'mock-materialShortDescription',
    productHierarchy: 'mock-productHierarchy',
    productHierarchyDescription: 'mock-productHierarchyDescription',
    materialIndentNumber: 'mock-materialIndentNumber',
    materialIndentNumberDescription: 'mock-materialIndentNumberDescription',
  },

  procurement: {
    plant: 'mock-plant',
    materialProcurementType: 'mock-materialProcurementType',
  },

  workCenter: {
    workCenter: 'mock-workCenter',
    workCenterDescription: 'mock-workCenterDescription',
    capacityUtilizationRate: 1234.567,
    replacementValue: 1234.567,
    costCenter: 'mock-costCenter',
    costCenterDescription: 'mock-costCenterDescription',
    profitCenter: 'mock-profitCenter',
  },

  costing: {
    costElements: 1234.567,
    costArea: 'mock-costArea',
    materialValuationClass: 'mock-materialValuationClass',
    costAreaCurrency: 'mock-costAreaCurrency',
    costAreaTotalPrice: 1234.567,
    costAreaFixedCost: 1234.567,
    costAreaVariableCost: 1234.567,
    costAreaFixedPrice: 1234.567,
    costAreaVariablePrice: 1234.567,
    costAreaTotalValue: 1234.567,
    companyCodeCurrency: 'mock-string',
    companyCodeObjectCurrency: 1234.567,
    companyCodeTotalPrice: 1234.567,
    companyCodeFixedCost: 1234.567,
    companyCodeVariableCost: 1234.567,
    companyCodeFixedPrice: 1234.567,
    companyCodeVariablePrice: 1234.567,
  },

  quantities: {
    quantity: 1234.567,
    lotsize: 1234.567,
    lotsizeUnit: 'mock-lotsizeUnit',
    baseUnitOfMeasure: 'mock-baseUnitOfMeasure',
    materialBudgetYearRequirement: 1234.567,
    materialAnnualDemandCount: 1234.567,
  },

  manufacturing: {
    costStaffSetup: 1234.567,
    costStaffProduction: 1234.567,
    costMachineProduction: 1234.567,
    costMachineSetup: 1234.567,
    costTool: 1234.567,
    cycleTime: 1234.567,
    additionalTimeMach: 1234.567,
    cycles: 1234.567,
    cyclesUnit: 'mock-cyclesUnit',
    time: 1234.567,
    setupTime: 1234.567,
    standardValueUnit: 'mock-standardValueUnit',
    headcountProduction: 1234.567,
    headcountSetup: 1234.567,
    tariffStaff: 1234.567,
    tariffMachine: 1234.567,
    tariffTool: 1234.567,
    tariffUnit: 1234.567,
  },

  scrap: {
    assemblyScrapQuantity: 1234.567,
    componentScrapQuantity: 1234.567,
  },

  purchase: {
    vendor: 'mock-vendor',
    vendorDescription: 'mock-vendorDescription',
  },
};
