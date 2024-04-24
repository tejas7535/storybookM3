import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { applicationConfig, Meta, moduleMetadata } from '@storybook/angular';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import {
  ShareButtonComponent,
  ShareButtonModule,
} from '@schaeffler/share-button';

import READMEMd from '../../../../../share-button/README.md';
import {
  getMultiLanguageStoryTemplate,
  STORYBOOK_TRANSLOCO_CONFIG,
} from '../../../../.storybook/storybook-transloco.constants';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { importProvidersFrom } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';

export default {
  title: 'Atomic/Molecules/Share Button',
  component: ShareButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [ShareButtonModule],
    }),
    applicationConfig({
      providers: [
        provideAnimations(),
        provideTransloco({
          config: STORYBOOK_TRANSLOCO_CONFIG,
        }),
        provideRouter([]),
        importProvidersFrom(
          ApplicationInsightsModule.forRoot({
            applicationInsightsConfig: {
              instrumentationKey: 'some key',
            },
          })
        ),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
} as Meta<ShareButtonComponent>;

export const Default = getMultiLanguageStoryTemplate.bind({});
Default.args = {};
