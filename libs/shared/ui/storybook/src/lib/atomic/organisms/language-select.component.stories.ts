import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { applicationConfig, Meta, moduleMetadata } from '@storybook/angular';

import {
  LanguageSelectComponent,
  LanguageSelectModule,
} from '@schaeffler/transloco/components';

import READMEMd from '../../../../../../utils/transloco/components/src/language-select/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

import {
  getMultiLanguageStoryTemplate,
  STORYBOOK_TRANSLOCO_CONFIG,
} from '../../../../.storybook/storybook-transloco.constants';
import { provideTransloco } from '@jsverse/transloco';

export default {
  title: 'Atomic/Organisms/Language Select',
  component: LanguageSelectComponent,
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
      imports: [LanguageSelectModule],
    }),
    applicationConfig({
      providers: [
        provideNoopAnimations(),
        provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG }),
      ],
    }),
  ],
} as Meta<LanguageSelectModule>;

export const WithoutPageRefresh = getMultiLanguageStoryTemplate.bind({});
WithoutPageRefresh.args = {
  reloadOnLanguageChange: false,
};

export const WithPageRefresh = getMultiLanguageStoryTemplate.bind({});
WithPageRefresh.args = {
  reloadOnLanguageChange: true,
};
