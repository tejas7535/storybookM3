import { CommonModule } from '@angular/common';

import { TranslocoModule } from '@ngneat/transloco';
import { action } from '@storybook/addon-actions';
import { boolean, number, text } from '@storybook/addon-knobs';
import { BannerTextModule } from 'libs/shared/ui/banner/src/lib/banner-text/banner-text.module';

import { BannerTextComponent } from '@schaeffler/banner';
import { IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import READMEMd from '../../../banner/README.md';

const moduleMetadata = {
  imports: [
    CommonModule,
    BannerTextModule,
    provideTranslocoTestingModule({ en: {} }),
    TranslocoModule,
    IconsModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: BannerTextComponent,
};

// eslint-disable-next-line
export default {
  title: 'Banner',
  parameters: {
    backgrounds: {
      default: 'Schaeffler',
      values: [{ name: 'Schaeffler', value: '#dee4e7' }],
    },
    notes: { markdown: READMEMd },
  },
};

const props = (icon: string, fullText = false) => ({
  text: text(
    'text',
    'This text can be modified to be longer. At a certain length it makes sense to use the "showFullText" and "truncateSize" parameter to prevent the banner from taking up to much sceenspace.'
  ),
  showFullText: boolean('showFullText', fullText),
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

export const expanded = () => ({
  ...baseComponent,
  props: {
    ...props('info', true),
  },
});
