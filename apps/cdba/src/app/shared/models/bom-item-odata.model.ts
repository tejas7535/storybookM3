// oData
export interface BomItemOdata {
  rowId: number;
  level: number;
  materialDesignation: string;
  materialNumber: string;
  parentMaterialNumber: string;
  predecessorsInTree: string[];

  bomIdentifier: {
    costingDate: string;
    costingNumber: string;
    costingType: string;
    version: string;
    enteredManually: boolean;
    referenceObject: string;
    valuationVariant: string;
  };

  bomInformation: {
    productCostingGroup: string;
    productCostingPlanCounter: string;
    productCostingBomNumber: string;
    productCostingBomUsage: string;
    productCostingBomAlternative: string;
  };

  material: {
    length: number;
    width: number;
    height: number;
    unitOfDimension: string;
    grossWeight: number;
    netWeight: number;
    unitOfWeight: string;
    materialShortDescription: string;
    productHierarchy: string;
    productHierarchyDescription: string;
    materialIndentNumber: string;
    materialIndentNumberDescription: string;
  };

  procurement: {
    plant: string;
    materialProcurementType: string;
  };

  workCenter: {
    workCenter: string;
    workCenterDescription: string;
    capacityUtilizationRate: number;
    replacementValue: number;
    costCenter: string;
    costCenterDescription: string;
    profitCenter: string;
  };

  costing: {
    costElements: number;
    costArea: string;
    materialValuationClass: string;
    costAreaCurrency: string;
    costAreaTotalPrice: number;
    costAreaFixedCost: number;
    costAreaVariableCost: number;
    costAreaFixedPrice: number;
    costAreaVariablePrice: number;
    costAreaTotalValue: number;
    companyCodeCurrency: string;
    companyCodeObjectCurrency: number;
    companyCodeTotalPrice: number;
    companyCodeFixedCost: number;
    companyCodeVariableCost: number;
    companyCodeFixedPrice: number;
    companyCodeVariablePrice: number;
  };

  quantities: {
    quantity: number;
    lotsize: number;
    lotsizeUnit: string;
    baseUnitOfMeasure: string;
    materialBudgetYearRequirement: number;
    materialAnnualDemandCount: number;
  };

  manufacturing: {
    costStaffSetup: number;
    costStaffProduction: number;
    costMachineProduction: number;
    costMachineSetup: number;
    costTool: number;
    cycleTime: number;
    additionalTimeMach: number;
    cycles: number;
    cyclesUnit: string;
    time: number;
    setupTime: number;
    standardValueUnit: string;
    headcountProduction: number;
    headcountSetup: number;
    tariffStaff: number;
    tariffMachine: number;
    tariffTool: number;
    tariffUnit: number;
  };

  scrap: {
    assemblyScrapQuantity: number;
    componentScrapQuantity: number;
  };

  purchase: {
    vendor: string;
    vendorDescription: string;
  };
}
