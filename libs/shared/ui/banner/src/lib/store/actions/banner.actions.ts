import { createAction, props } from '@ngrx/store';

import { BannerType } from '../../banner-text/banner-text.component';

export const openBanner = createAction(
  '[Banner] Open Banner',
  props<{
    text: string;
    buttonText: string;
    icon: BannerType;
    truncateSize: number;
  }>()
);

export const closeBanner = createAction('[Banner] Close Banner');

export const toggleFullText = createAction('[Banner] Toggle Full Text');
