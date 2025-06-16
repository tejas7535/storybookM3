import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CalculationParametersFacade } from '@ga/core/store';
import { Grease } from '@ga/shared/services/greases/greases.service';

import { GreaseReportSubordinate, GreaseResult } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class GreaseMiscibilityService {
  private readonly calculationParameters = inject(CalculationParametersFacade);

  private readonly mixableSchaefflerGreases = toSignal(
    this.calculationParameters.mixableSchaefflerGreases$
  );

  markMixableGreases(
    greaseSubordinates: GreaseReportSubordinate[]
  ): GreaseReportSubordinate[] {
    const mixableGreases = this.mixableSchaefflerGreases() || [];

    if (mixableGreases.length === 0) {
      return greaseSubordinates;
    }

    const markedSubordinates = this.markGreasesAsMiscible(
      greaseSubordinates,
      mixableGreases
    );

    return this.sortSubordinatesByMiscibility(markedSubordinates);
  }

  private markGreasesAsMiscible(
    subordinates: GreaseReportSubordinate[],
    mixableGreases: Grease[]
  ): GreaseReportSubordinate[] {
    return subordinates.map((subordinate) => {
      if (subordinate.identifier === 'greaseResult') {
        const isMiscible = this.determineIfMiscible(
          subordinate.greaseResult,
          mixableGreases
        );

        return {
          ...subordinate,
          greaseResult: {
            ...subordinate.greaseResult,
            isMiscible,
          },
        };
      }

      return subordinate;
    });
  }

  private sortSubordinatesByMiscibility(
    subordinates: GreaseReportSubordinate[]
  ): GreaseReportSubordinate[] {
    const greaseResults: GreaseReportSubordinate[] = [];
    const otherContent: GreaseReportSubordinate[] = [];

    subordinates.forEach((item) => {
      if (item.identifier === 'greaseResult') {
        greaseResults.push(item);
      } else {
        otherContent.push(item);
      }
    });

    const sortedGreases = [...greaseResults].sort((a, b) => {
      if (a.greaseResult?.isMiscible === b.greaseResult?.isMiscible) {
        return 0;
      }

      if (a.greaseResult?.isMiscible && !b.greaseResult?.isMiscible) {
        return -1;
      }

      return 1;
    });

    return [...otherContent, ...sortedGreases];
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
