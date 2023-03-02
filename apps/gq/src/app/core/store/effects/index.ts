import { CreateCaseEffects } from './create-case/create-case.effects';
import { ExtendedComparableLinkedTransactionsEffect } from './extended-comparable-linked-transactions/extended-comparable-linked-transactions.effects';
import { HealthCheckEffects } from './health-check/health-check.effects';
import { MaterialComparableCostEffect } from './material-comparable-costs/material-comparable-costs.effects';
import { MaterialCostDetailsEffects } from './material-cost-details/material-cost-details.effects';
import { MaterialSalesOrgEffect } from './material-sales-org/material-sales-org.effects';
import { MaterialStockEffects } from './material-stock/material-stock.effects';
import { PlantMaterialDetailsEffects } from './plant-material-details/plant-material-details.effects';
import { ProcessCaseEffect } from './process-case/process-case.effects';
import { SapPriceDetailsEffects } from './sap-price-details/sap-price-details.effects';
import { TransactionsEffect } from './transactions/transactions.effects';
import { ViewCasesEffect } from './view-cases/view-cases.effects';

export const effects = [
  CreateCaseEffects,
  ProcessCaseEffect,
  ViewCasesEffect,
  TransactionsEffect,
  MaterialComparableCostEffect,
  MaterialSalesOrgEffect,
  ExtendedComparableLinkedTransactionsEffect,
  HealthCheckEffects,
  SapPriceDetailsEffects,
  MaterialStockEffects,
  PlantMaterialDetailsEffects,
  MaterialCostDetailsEffects,
];

export { CreateCaseEffects } from './create-case/create-case.effects';
export { ExtendedComparableLinkedTransactionsEffect } from './extended-comparable-linked-transactions/extended-comparable-linked-transactions.effects';
export { HealthCheckEffects } from './health-check/health-check.effects';
export { MaterialComparableCostEffect } from './material-comparable-costs/material-comparable-costs.effects';
export { MaterialCostDetailsEffects } from './material-cost-details/material-cost-details.effects';
export { MaterialSalesOrgEffect } from './material-sales-org/material-sales-org.effects';
export { MaterialStockEffects } from './material-stock/material-stock.effects';
export { PlantMaterialDetailsEffects } from './plant-material-details/plant-material-details.effects';
export { ProcessCaseEffect } from './process-case/process-case.effects';
export { SapPriceDetailsEffects } from './sap-price-details/sap-price-details.effects';
export { TransactionsEffect } from './transactions/transactions.effects';
export { ViewCasesEffect } from './view-cases/view-cases.effects';
