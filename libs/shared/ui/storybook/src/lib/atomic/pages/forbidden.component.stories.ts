import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';

import { ForbiddenComponent, ForbiddenModule } from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/forbidden/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import {
  STORYBOOK_TRANSLOCO_CONFIG,
  getMultiLanguageStoryTemplate,
} from '../../../../.storybook/storybook-transloco.constants';
import { provideTransloco } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';

export default {
  title: 'Atomic/Pages/Forbidden',
  component: ForbiddenComponent,
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
      imports: [ForbiddenModule],
    }),
    applicationConfig({
      providers: [
        provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG }),
        provideRouter([]),
      ],
    }),
  ],
} as Meta<ForbiddenComponent>;

export const Default = getMultiLanguageStoryTemplate.bind({});

export const HideHomeButton = getMultiLanguageStoryTemplate.bind({});
HideHomeButton.args = {
  routeData: {
    hideHomeButton: true,
  },
};

export const AddActionButton = getMultiLanguageStoryTemplate.bind({});
AddActionButton.args = {
  routeData: {
    action: 'mailto:it-support-sg@schaeffler.com',
  },
};

export const OnlyActionButton = getMultiLanguageStoryTemplate.bind({});
OnlyActionButton.args = {
  routeData: {
    action: 'mailto:it-support-sg@schaeffler.com',
    hideHomeButton: true,
  },
};

export const VariableText = getMultiLanguageStoryTemplate.bind({});
VariableText.args = {
  routeData: {
    headingText: 'Variable Heading',
    messageText:
      'This is a variable message text, as long as you wish.\nLine breaks do also work here.',
    action: 'mailto:it-support-sg@schaeffler.com',
    actionButtonText: 'Variable Action Button',
    homeButtonText: 'Variable Home Button',
  },
};
