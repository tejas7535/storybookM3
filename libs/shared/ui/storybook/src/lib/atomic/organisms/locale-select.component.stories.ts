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
  STORYBOOK_TRANSLOCO_CONFIG,
} from '../../../../.storybook/storybook-transloco.constants';
import { provideTransloco } from '@jsverse/transloco';
import { provideTranslocoLocale } from '@jsverse/transloco-locale';

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
        provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG }),
        provideTranslocoLocale(),
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
