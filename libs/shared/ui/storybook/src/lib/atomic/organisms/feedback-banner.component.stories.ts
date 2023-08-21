import { CommonModule } from '@angular/common';

import { TranslocoModule } from '@ngneat/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';
import { BannerTextModule } from 'libs/shared/ui/banner/src/lib/banner-text/banner-text.module';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';

import READMEMd from '../../../../../feedback-banner/README.md';

import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';
import { importProvidersFrom } from '@angular/core';

export default {
  title: 'Atomic/Organisms/Feedback Banner',
  component: FeedbackBannerComponent,
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BannerTextModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
    applicationConfig({
      providers: [importProvidersFrom(StorybookTranslocoModule)],
    }),
  ],
} as Meta<FeedbackBannerComponent>;

const Template: StoryFn<FeedbackBannerComponent> = (
  args: FeedbackBannerComponent
) => ({
  component: FeedbackBannerComponent,
  props: args,
});

const props = () => ({
  infoText: `Your feedback is important to us, and we invite you to participate in our survey to help us improve. 
    Your insights will guide our efforts to enhance our product, and we appreciate your time and feedback.`,
  providedLanguages: ['en', 'de'],
  feedbackButtonText: 'Feedback',
  surveyUrl: 'https://www.surveyUrl.com?lang=',
});

export const Primary = Template.bind({});
Primary.args = {
  ...props(),
};
