import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { action } from '@storybook/addon-actions';
import { boolean, number, text } from '@storybook/addon-knobs';

import {
  bannerLoader,
  BannerModule,
  BannerTextComponent,
} from '@schaeffler/banner';
import { IconsModule } from '@schaeffler/icons';
import {
  provideTranslocoTestingModule,
  SharedTranslocoModule,
} from '@schaeffler/transloco';

import READMEMd from '../../../banner/README.md';
import enJson from '../../../banner/src/lib/i18n/en.json';

const moduleMetadata = {
  imports: [
    CommonModule,
    BannerModule,
    StoreModule.forRoot({}),
    provideTranslocoTestingModule({ enJson }),
    SharedTranslocoModule.forChild('banner', bannerLoader),
    IconsModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: BannerTextComponent,
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'Banner',
  parameters: {
    backgrounds: [{ name: 'Schaeffler', value: '#dee4e7', default: true }],
    notes: { markdown: READMEMd },
  },
};

const props = (icon: string) => ({
  text: text(
    'text',
    'This text can be modified to be longer. At a certain length it makes sense to use the "showFullText" and "truncateSize" parameter to prevent the banner from taking up to much sceenspace.'
  ),
  showFullText: boolean('showFullText', false),
  bannerIcon: text('bannerIcon', icon),
  truncateSize: number('truncateSize', 180),
  buttonText: text('buttonText', 'Okay'),
  closeBanner: action('closeBanner'),
  toggleFullText: action('toggleFullText'),
});

export const info = () => ({
  ...baseComponent,
  props: {
    ...props('info'),
  },
});

export const warning = () => ({
  ...baseComponent,
  props: {
    ...props('warning'),
  },
});

export const error = () => ({
  ...baseComponent,
  props: {
    ...props('error'),
  },
});

export const success = () => ({
  ...baseComponent,
  props: {
    ...props('success'),
  },
});
