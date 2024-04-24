import { CommonModule } from '@angular/common';

import { provideTransloco } from '@jsverse/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';
import { BannerTextModule } from 'libs/shared/ui/banner/src/lib/banner-text/banner-text.module';

import { FeedbackBannerComponent } from '@schaeffler/feedback-banner';

import READMEMd from '../../../../../feedback-banner/README.md';

import { STORYBOOK_TRANSLOCO_CONFIG } from '../../../../.storybook/storybook-transloco.constants';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';

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
      imports: [CommonModule, BannerTextModule],
    }),
    applicationConfig({
      providers: [provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG })],
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
