import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata } from '@storybook/angular';

import {
  LanguageSelectComponent,
  LanguageSelectModule,
} from '@schaeffler/transloco/components';

import READMEMd from '../../../../../../utils/transloco/components/src/language-select/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import {
  getMultiLanguageStoryTemplate,
  StorybookTranslocoModule,
} from '../../../../.storybook/storybook-transloco.module';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Language Select`,
  component: LanguageSelectComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [
        NoopAnimationsModule,
        StorybookTranslocoModule,
        LanguageSelectModule,
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
