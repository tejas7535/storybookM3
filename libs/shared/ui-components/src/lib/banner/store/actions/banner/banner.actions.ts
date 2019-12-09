import { createAction, props } from '@ngrx/store';

export const setBannerState = createAction(
  '[Banner] Set Banner State',
  props<{
    text: string;
    buttonText: string;
    truncateSize: number;
    isFullTextShown: boolean;
    open: boolean;
  }>()
);

export const openBanner = createAction(
  '[Banner] Open Banner',
  props<{
    component: any;
    text: string;
    buttonText: string;
    truncateSize: number;
  }>()
);

export const toggleFullText = createAction(
  '[Banner] Toggle Full Text',
  props<{ isFullTextShown: boolean }>()
);

export const setBannerUrl = createAction(
  '[Banner] Set Banner Url',
  props<{ url: string }>()
);

export const finishOpenBanner = createAction('[Banner] Finish open Banner');

export const closeBanner = createAction('[Banner] Close Banner');
