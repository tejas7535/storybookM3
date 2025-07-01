import { provideRouter } from '@angular/router';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

import {
  PageNotFoundComponent,
  PageNotFoundModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/page-not-found/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { STORYBOOK_TRANSLOCO_CONFIG } from '../../../../.storybook/storybook-transloco.constants';

import { provideTransloco } from '@jsverse/transloco';

const meta: Meta<typeof PageNotFoundComponent> = {
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
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
