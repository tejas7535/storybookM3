import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Meta, moduleMetadata } from '@storybook/angular';

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
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Share Button`,
  component: ShareButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [
        // necessary module imports
        BrowserAnimationsModule,
        RouterModule.forRoot([], {
          useHash: true,
        }),
        ApplicationInsightsModule.forRoot({
          applicationInsightsConfig: {
            instrumentationKey: 'some key',
          },
        }),
        StorybookTranslocoModule,
        ShareButtonModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<ShareButtonComponent>;

export const Default = getMultiLanguageStoryTemplate.bind({});
Default.args = {};
