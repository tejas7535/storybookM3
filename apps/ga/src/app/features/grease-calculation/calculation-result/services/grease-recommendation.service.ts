import { inject, Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { addResultMessage, CalculationParametersFacade } from '@ga/core/store';
import { environment } from '@ga/environments/environment';
import { Movement } from '@ga/shared/models';

import { ApplicationScenario } from '../../calculation-parameters/constants/application-scenarios.model';
import {
  OscillatingMotionRecommendation,
  RecommendationMappings,
} from '../constants/recommendation.constants';
import { GreaseResult } from '../models';

@Injectable({ providedIn: 'root' })
export class GreaseRecommendationService {
  private readonly store = inject(Store);
  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );
  private readonly transloco = inject(TranslocoService);

  public async processGreaseRecommendation(greaseResults: GreaseResult[]) {
    this.consoleLogGreaseTableForDevOnly(
      greaseResults,
      'Order of Greases before applying recommendation logic'
    );

    const application = await firstValueFrom(
      this.calculationParametersFacade.selectedGreaseApplication$
    );

    if (application !== ApplicationScenario.All && !!application) {
      const recommendedGreaseIndex = RecommendationMappings[application]
        .flatMap((mapping) =>
          typeof mapping === 'string' ? mapping : mapping.greaseName
        )
        .map((grease) =>
          greaseResults.findIndex(
            (greaseResult) =>
              greaseResult?.mainTitle === grease && greaseResult.isSufficient
          )
        )
        .filter((idx) => idx > -1)
        .sort((a, b) => a - b)
        .shift();

      if (recommendedGreaseIndex === undefined) {
        this.dispatchErrorMessage();
      } else {
        greaseResults[recommendedGreaseIndex].isRecommended = true;

        if (recommendedGreaseIndex > 0) {
          greaseResults.unshift(
            greaseResults.splice(recommendedGreaseIndex, 1)[0]
          );
        }
      }
    }

    const typeOfMotion = await firstValueFrom(
      this.calculationParametersFacade.motionType$
    );

    if (typeOfMotion === Movement.oscillating) {
      const movementIdx = OscillatingMotionRecommendation.map((grease) =>
        greaseResults
          .filter((greaseResult) => greaseResult.isSufficient)
          .findIndex(
            (greaseResult) =>
              greaseResult.mainTitle === grease && greaseResult.isSufficient
          )
      )
        .filter((idx) => idx > -1)
        .sort((a, b) => a - b)
        .shift();

      if (movementIdx !== undefined) {
        greaseResults[movementIdx].isRecommended = true;
        if (movementIdx > 0) {
          greaseResults.unshift(greaseResults.splice(movementIdx, 1)[0]);
        }
      }
    }

    this.consoleLogGreaseTableForDevOnly(
      greaseResults,
      'Order of Greases after applying recommendation logic'
    );
  }

  private dispatchErrorMessage() {
    this.store.dispatch(
      addResultMessage({
        message: {
          text: this.transloco.translate('calculationResult.noRecommendation'),
          links: [
            {
              text: this.transloco.translate('calculationResult.contact'),
              url: this.transloco.translate(
                'homepage.cards.contact.externalLink'
              ),
            },
          ],
        },
      })
    );
  }

  private consoleLogGreaseTableForDevOnly(
    greaseResults: GreaseResult[],
    debugLineTitle: string
  ): void {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log(debugLineTitle);
      // eslint-disable-next-line no-console
      console.table(
        greaseResults.map((greaseResult, idx) => ({
          grease: greaseResult?.mainTitle,
          index: idx,
          sufficient: greaseResult.isSufficient,
        }))
      );
    }
  }
}
