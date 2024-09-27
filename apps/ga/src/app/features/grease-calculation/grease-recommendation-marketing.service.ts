import { Injectable } from '@angular/core';

import { combineLatest, map } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { getGreaseApplication } from '@ga/core/store/selectors/calculation-parameters/calculation-parameters.selector';
import {
  getAppIsEmbedded,
  getIsMediasAuthenticated,
} from '@ga/core/store/selectors/settings/settings.selector';

import { ApplicationScenario } from './calculation-parameters/constants/application-scenarios.model';

@Injectable({ providedIn: 'root' })
export class GreaseRecommendationMarketingService {
  public readonly isMediasAuthenticated$ = this.store.select(
    getIsMediasAuthenticated
  );
  public readonly isEmbedded$ = this.store.select(getAppIsEmbedded);
  public readonly selectedApplication$ =
    this.store.select(getGreaseApplication);

  public readonly shouldShowMarketing$ = combineLatest([
    this.isMediasAuthenticated$,
    this.isEmbedded$,
  ]).pipe(map(([authenticated, embedded]) => !authenticated && embedded));

  public readonly shouldShowRecommendation$ = combineLatest([
    this.isMediasAuthenticated$,
    this.isEmbedded$,
  ]).pipe(
    map(([authenticated, embedded]) => (embedded ? authenticated : false))
  );

  public readonly shouldShowDynamicModal$ = combineLatest([
    this.shouldShowMarketing$,
    this.selectedApplication$,
  ]).pipe(
    map(
      ([showMarketing, selectedApplication]) =>
        showMarketing &&
        selectedApplication !== ApplicationScenario.All &&
        !!selectedApplication
    )
  );

  constructor(
    private readonly store: Store,
    private readonly transloco: TranslocoService
  ) {}

  public getUtmSignupUrl(medium: 'signup-cta' | 'result-popup') {
    const campaign_id = 'greasapp_recommendation_medias';
    const campaign = 'greaseapp_recommendation';
    const source = 'greaseapp';

    return this.transloco.langChanges$.pipe(
      map(() => {
        const query = `?utm_id=${campaign_id}&utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;

        const url = this.getEmbeddingPageUrl();

        return `${url}${query}`;
      })
    );
  }

  /**
   * This method is used to get the URL of the page that embeds the Grease App in an ifRame.
   * This is being used to redirect the user to the appropiate sign-up URL.
   *
   * HOWEVER: This approach is only supported in Google Chrome and Chrome based browsers,
   * it is NOT supported in Firefox. To retain the core functionality, the fallback with the
   * transloco based localization is being used
   *
   * This implementation is based on a satckoverflow post and tested with Chrome 127.0.6533.100
   * and Firefox 129.0.1
   *
   * @see https://stackoverflow.com/a/66060655
   **/
  private getEmbeddingPageUrl(): string {
    if (
      document.location.ancestorOrigins &&
      document.location.ancestorOrigins.length > 0
    ) {
      return `${document.location.ancestorOrigins[0]}/registered/user`;
    }

    return this.transloco.translate('parameters.signupUrl');
  }
}
