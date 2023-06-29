import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { applicationConfig, Meta, moduleMetadata } from '@storybook/angular';

import {
  LocaleSelectComponent,
  LocaleSelectModule,
} from '@schaeffler/transloco/components';

import READMEMd from '../../../../../../utils/transloco/components/src/locale-select/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

import {
  getMultiLanguageStoryTemplate,
  StorybookTranslocoModule,
} from '../../../../.storybook/storybook-transloco.module';
import { importProvidersFrom } from '@angular/core';

export default {
  title: 'Atomic/Organisms/Locale Select',
  component: LocaleSelectComponent,
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
      imports: [LocaleSelectModule],
    }),
    applicationConfig({
      providers: [
        provideNoopAnimations(),
        importProvidersFrom(StorybookTranslocoModule),
        importProvidersFrom(LocaleSelectModule),
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
