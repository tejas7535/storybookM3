import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { applicationConfig, Meta, moduleMetadata } from '@storybook/angular';

import { ApplicationInsightsModule } from '@schaeffler/application-insights';
import {
  ShareButtonComponent,
  ShareButtonModule,
} from '@schaeffler/share-button';

import READMEMd from '../../../../../share-button/README.md';
import {
  getMultiLanguageStoryTemplate,
  StorybookTranslocoModule,
} from '../../../../.storybook/storybook-transloco.module';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { importProvidersFrom } from '@angular/core';

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
        importProvidersFrom(StorybookTranslocoModule),
        importProvidersFrom(
          RouterModule.forRoot([], {
            useHash: true,
          })
        ),
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
