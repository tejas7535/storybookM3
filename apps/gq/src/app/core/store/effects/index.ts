import { CreateCaseEffects } from './create-case/create-case.effects';
import { ProcessCaseEffect } from './process-case/process-case.effect';
import { ViewCasesEffect } from './view-cases/view-cases.effect';

export const effects = [CreateCaseEffects, ProcessCaseEffect, ViewCasesEffect];
