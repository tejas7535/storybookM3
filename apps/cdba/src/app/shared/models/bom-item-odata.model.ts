// oData
export interface BomItemOdata {
  rowId: number;
  level: number;
  materialDesignation: string;
  materialNumber: string;
  parentMaterialNumber: string;
  costShareOfParent: number;
  predecessorsInTree: string[];

  bomIdentifier: OdataBomIdentifier;

  bomInformation: {
    productCostingGroup: string;
    productCostingPlanCounter: string;
    productCostingBomNumber: string;
    productCostingBomUsage: string;
    productCostingBomAlternative: string;
  };

  materialCharacteristics: {
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
    valuationClass: string;
  };

  procurement: {
    plant: string;
    materialProcurementType: string;
    vendor: string;
    vendorDescription: string;
  };

  workCenter: {
    workCenter: string;
    workCenterDescription: string;
    costCenter: string;
    costCenterDescription: string;
    profitCenter: string;
    capacityUtilizationRate: number;
    replacementValue: number;
  };

  costing: {
    costElements: number;
    costArea: string;

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
    assemblyScrapQuantity: number;
    componentScrapQuantity: number;
  };

  manufacturing: {
    staffSetupCosts: number;
    staffProductionCosts: number;
    machineProductionCosts: number;
    machineSetupCosts: number;
    toolCosts: number;
    cycleTime: number;
    additionalTimeMachine: number;
    cycles: number;
    cyclesUnit: string;
    totalProductionTime: number;
    setupTime: number;
    standardValueUnit: string;
    headcountProduction: number;
    headcountSetup: number;
    staffTariff: number;
    machineTariff: number;
    toolTariff: number;
    tariffUnit: number;
  };
}

export interface OdataBomIdentifier {
  costingDate: string;
  costingNumber: string;
  costingType: string;
  version: string;
  enteredManually: boolean;
  referenceObject: string;
  valuationVariant: string;
}
