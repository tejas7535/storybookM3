import { RouterTestingModule } from '@angular/router/testing';

import { Meta, moduleMetadata } from '@storybook/angular';

import { ForbiddenComponent, ForbiddenModule } from '@schaeffler/empty-states';

import READMEMd from '../../../empty-states/src/lib/forbidden/README.md';
import { getMultiLanguageStoryTemplate } from '../../.storybook/storybook-transloco.module';

export default {
  title: 'Components/Forbidden',
  component: ForbiddenComponent,
  parameters: {
    backgrounds: {
      default: 'Schaeffler',
      values: [{ name: 'Schaeffler', value: '#fafafa' }],
    },
    notes: { markdown: READMEMd },
  },
  decorators: [
    moduleMetadata({
      imports: [ForbiddenModule, RouterTestingModule],
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
