import { createAction, props } from '@ngrx/store';

export const openBanner = createAction(
  '[Banner] Open Banner',
  props<{
    text: string;
    buttonText: string;
    truncateSize: number;
  }>()
);

export const closeBanner = createAction('[Banner] Close Banner');

export const toggleFullText = createAction('[Banner] Toggle Full Text');
