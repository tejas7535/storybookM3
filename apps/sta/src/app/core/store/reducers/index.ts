import { Params, RouterStateSnapshot } from '@angular/router';

import * as fromRouter from '@ngrx/router-store';
import {
  ActionReducerMap,
  createFeatureSelector,
  MetaReducer,
} from '@ngrx/store';

import { environment } from '../../../../environments/environment';
import * as fromQuestionAnswering from './question-answering/question-answering.reducer';
import * as fromTagging from './tagging/tagging.reducer';
import * as fromTranslation from './translation/translation.reducer';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AppState {
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  tagging: fromTagging.TaggingState;
  translation: fromTranslation.TranslationState;
  questionAnswering: fromQuestionAnswering.QuestionAnsweringState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer,
  tagging: fromTagging.taggingReducer,
  translation: fromTranslation.translationReducer,
  questionAnswering: fromQuestionAnswering.questionAnsweringReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : /* istanbul ignore next: very difficult */ [];

export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('router');

export const getTaggingState = createFeatureSelector<fromTagging.TaggingState>(
  'tagging'
);

export const getTranslationState = createFeatureSelector<
  fromTranslation.TranslationState
>('translation');

export const getQuestionAnsweringState = createFeatureSelector<
  fromQuestionAnswering.QuestionAnsweringState
>('questionAnswering');

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  /**
   * Serialize the router state
   */
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
