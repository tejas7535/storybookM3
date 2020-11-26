import { CreateCaseEffects } from './create-case/create-case.effects';
import { DetailCaseEffects } from './detail-case/detail-case.effects';
import { ProcessCaseEffect } from './process-case/process-case.effect';
import { ViewCasesEffect } from './view-cases/view-cases.effect';

export const effects = [
  CreateCaseEffects,
  DetailCaseEffects,
  ProcessCaseEffect,
  ViewCasesEffect,
];
