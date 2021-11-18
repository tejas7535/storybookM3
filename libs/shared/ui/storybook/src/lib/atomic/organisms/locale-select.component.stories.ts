import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata } from '@storybook/angular';

import {
  LocaleSelectComponent,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import READMEMd from '../../../../../../utils/transloco/components/src/locale-select/README.md';

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
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Locale Select`,
  component: LocaleSelectComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [
        NoopAnimationsModule,
        StorybookTranslocoModule,
        LocaleSelectModule,
      ],
    }),
  ],
} as Meta<LocaleSelectModule>;

export const WithoutPageRefresh = getMultiLanguageStoryTemplate.bind({});
WithoutPageRefresh.args = {
  reloadOnLocaleChange: false,
};

export const WithPageRefresh = getMultiLanguageStoryTemplate.bind({});
WithPageRefresh.args = {
  reloadOnLocaleChange: true,
};

export const CustomTexts = getMultiLanguageStoryTemplate.bind({});
CustomTexts.args = {
  hintText: 'Custom hint text',
  tooltipText: 'Custom tooltip text',
};
