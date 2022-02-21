import { CreateCaseEffects } from './create-case/create-case.effects';
import { ExtendedComparableLinkedTransactionsEffect } from './extended-comparable-linked-transactions/extended-comparable-linked-transactions.effects';
import { HealthCheckEffects } from './health-check/health-check.effects';
import { MaterialComparableCostEffect } from './material-comparable-costs/material-comparable-costs.effects';
import { MaterialSalesOrgEffect } from './material-sales-org/material-sales-org.effects';
import { MaterialStockEffects } from './material-stock/material-stock.effects';
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
];
