import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { addResultMessage } from '@ga/core/store';
import { getMotionType } from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import { environment } from '@ga/environments/environment';
import { Movement } from '@ga/shared/models';

import { ApplicationScenario } from '../../calculation-parameters/constants/application-scenarios.model';
import { GreaseRecommendationMarketingService } from '../../grease-recommendation-marketing.service';
import {
  OscillatingMotionRecommendation,
  RecommendationMappings,
} from '../constants/recommendation.constants';
import { GreaseReportSubordinate } from '../models';

@Injectable({ providedIn: 'root' })
export class GreaseRecommendationService {
  constructor(
    private readonly store: Store,
    private readonly marketingService: GreaseRecommendationMarketingService,
    private readonly transloco: TranslocoService
  ) {}

  public async processGreaseRecommendation(
    subordinates: GreaseReportSubordinate[]
  ) {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log('Order of Greases before applying recommendation logic');
      // eslint-disable-next-line no-console
      console.table(
        subordinates.map((sub, idx) => ({
          grease: sub.greaseResult?.mainTitle,
          index: idx,
          sufficient: sub.greaseResult.isSufficient,
        }))
      );
    }

    const application = await firstValueFrom(
      this.marketingService.selectedApplication$
    );
    const shouldShowRecommendation = await firstValueFrom(
      this.marketingService.shouldShowRecommendation$
    );

    if (
      application !== ApplicationScenario.All &&
      !!application &&
      shouldShowRecommendation
    ) {
      const recommendedGreaseIndex = RecommendationMappings[application]
        .flatMap((mapping) =>
          typeof mapping === 'string' ? mapping : mapping.greaseName
        )
        .map((grease) =>
          subordinates.findIndex(
            (resultGrease) =>
              resultGrease.greaseResult?.mainTitle === grease &&
              resultGrease.greaseResult.isSufficient
          )
        )
        .filter((idx) => idx > -1)
        .sort((a, b) => a - b)
        .shift();

      if (recommendedGreaseIndex === undefined) {
        this.dispatchErrorMessage();
      } else {
        subordinates[recommendedGreaseIndex].greaseResult.isRecommended = true;

        if (recommendedGreaseIndex > 0) {
          subordinates.unshift(
            subordinates.splice(recommendedGreaseIndex, 1)[0]
          );
        }
      }
    }

    const typeOfMotion = await firstValueFrom(this.store.select(getMotionType));

    if (typeOfMotion === Movement.oscillating && shouldShowRecommendation) {
      const movementIdx = OscillatingMotionRecommendation.map((grease) =>
        subordinates
          .filter((sub) => sub.greaseResult.isSufficient)
          .findIndex(
            (resultGrease) =>
              resultGrease.greaseResult.mainTitle === grease &&
              resultGrease.greaseResult.isSufficient
          )
      )
        .filter((idx) => idx > -1)
        .sort((a, b) => a - b)
        .shift();
      if (movementIdx !== undefined) {
        subordinates[movementIdx].greaseResult.isRecommended = true;
        if (movementIdx > 0) {
          subordinates.unshift(subordinates.splice(movementIdx, 1)[0]);
        }
      }
    }

    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.log('Order of Greases after applying recommendation logic');
      // eslint-disable-next-line no-console
      console.table(
        subordinates.map((sub, idx) => ({
          grease: sub.greaseResult?.mainTitle,
          index: idx,
          sufficient: sub.greaseResult.isSufficient,
        }))
      );
    }
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
}
