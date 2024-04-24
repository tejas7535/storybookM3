import { provideRouter } from '@angular/router';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/page-not-found/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { STORYBOOK_TRANSLOCO_CONFIG } from '../../../../.storybook/storybook-transloco.constants';

import { provideTransloco } from '@jsverse/transloco';

export default {
  title: 'Atomic/Pages/Page Not Found',
  component: PageNotFoundComponent,
  decorators: [
    moduleMetadata({
      imports: [PageNotFoundModule],
    }),
    applicationConfig({
      providers: [
        provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG }),
        provideRouter([]),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
} as Meta<PageNotFoundComponent>;

const Template: StoryFn<PageNotFoundComponent> = (
  args: PageNotFoundComponent
) => ({
  component: PageNotFoundComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
