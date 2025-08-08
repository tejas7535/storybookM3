import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CalculationParametersFacade } from '@ga/core/store';
import { Grease } from '@ga/shared/services/greases/greases.service';

import { GreaseResult } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class GreaseMiscibilityService {
  private readonly calculationParameters = inject(CalculationParametersFacade);

  private readonly mixableSchaefflerGreases = toSignal(
    this.calculationParameters.mixableSchaefflerGreases$
  );

  markMixableGreases(greaseResults: GreaseResult[]): GreaseResult[] {
    const mixableGreases = this.mixableSchaefflerGreases() || [];

    if (mixableGreases.length === 0) {
      return greaseResults;
    }

    const markedGreaseResults = this.markGreasesAsMiscible(
      greaseResults,
      mixableGreases
    );

    return this.sortSubordinatesByMiscibility(markedGreaseResults);
  }

  private markGreasesAsMiscible(
    greaseResults: GreaseResult[],
    mixableGreases: Grease[]
  ): GreaseResult[] {
    return greaseResults.map((greaseResult) => {
      const isMiscible = this.determineIfMiscible(greaseResult, mixableGreases);

      return {
        ...greaseResult,
        isMiscible,
      };
    });
  }

  private sortSubordinatesByMiscibility(
    greaseResults: GreaseResult[]
  ): GreaseResult[] {
    return greaseResults.sort((a, b) => {
      if (a.isMiscible === b.isMiscible) {
        return 0;
      }

      return a.isMiscible ? -1 : 1;
    });
  }

  private determineIfMiscible(
    greaseResult: GreaseResult,
    mixableGreases: Grease[]
  ): boolean {
    const schaefflerGreaseName = greaseResult.mainTitle;

    const isMiscible = mixableGreases.some(
      (grease) =>
        grease.name?.trim().toLowerCase() ===
          schaefflerGreaseName?.trim().toLowerCase() ||
        grease.id?.trim().toLowerCase() ===
          schaefflerGreaseName?.trim().toLowerCase()
    );

    return isMiscible;
  }
}
