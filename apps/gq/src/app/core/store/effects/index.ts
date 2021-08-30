import { CreateCaseEffects } from './create-case/create-case.effects';
import { ProcessCaseEffect } from './process-case/process-case.effects';
import { TransactionsEffect } from './transactions/transactions.effects';
import { ViewCasesEffect } from './view-cases/view-cases.effects';
import { MaterialAlternativeCostEffect } from './material-alternative-costs/material-alternative-costs.effects';

export const effects = [
  CreateCaseEffects,
  ProcessCaseEffect,
  ViewCasesEffect,
  TransactionsEffect,
  MaterialAlternativeCostEffect,
];
