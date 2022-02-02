import { createAction, props } from '@ngrx/store';

import { BannerIconType } from '../../banner-text/banner-text.component';

export const openBanner = createAction(
  '[Banner] Open Banner',
  props<{
    text: string;
    buttonText: string;
    icon: BannerIconType;
    truncateSize: number;
  }>()
);

export const closeBanner = createAction('[Banner] Close Banner');

export const toggleFullText = createAction('[Banner] Toggle Full Text');
