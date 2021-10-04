import { CreateCaseEffects } from './create-case/create-case.effects';
import { ExtendedComparableLinkedTransactionsEffect } from './extended-comparable-linked-transactions/extended-comparable-linked-transactions.effects';
import { HealthCheckEffects } from './health-check/health-check.effects';
import { MaterialAlternativeCostEffect } from './material-alternative-costs/material-alternative-costs.effects';
import { ProcessCaseEffect } from './process-case/process-case.effects';
import { TransactionsEffect } from './transactions/transactions.effects';
import { ViewCasesEffect } from './view-cases/view-cases.effects';
import { MaterialSalesOrgEffect } from './material-sales-org/material-sales-org.effects';

export const effects = [
  CreateCaseEffects,
  ProcessCaseEffect,
  ViewCasesEffect,
  TransactionsEffect,
  MaterialAlternativeCostEffect,
  MaterialSalesOrgEffect,
  ExtendedComparableLinkedTransactionsEffect,
  HealthCheckEffects,
];
