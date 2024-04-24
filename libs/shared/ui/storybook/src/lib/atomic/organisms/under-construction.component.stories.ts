import { provideTransloco } from '@jsverse/transloco';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/under-construction/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { STORYBOOK_TRANSLOCO_CONFIG } from '../../../../.storybook/storybook-transloco.constants';

export default {
  title: 'Atomic/Organisms/Under Construction',
  component: UnderConstructionComponent,
  decorators: [
    moduleMetadata({
      imports: [UnderConstructionModule],
    }),
    applicationConfig({
      providers: [provideTransloco({ config: STORYBOOK_TRANSLOCO_CONFIG })],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.NeedsRevision],
  },
} as Meta<UnderConstructionComponent>;

const Template: StoryFn<UnderConstructionComponent> = (
  args: UnderConstructionComponent
) => ({
  component: UnderConstructionComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};

export const WithCustomText = Template.bind({});
WithCustomText.args = {
  title: 'Incoming feature!',
  message: 'This feature will come soon.',
};
