import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/under-construction/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';

export default {
  title: 'Atomic/Organisms/Under Construction',
  component: UnderConstructionComponent,
  decorators: [
    moduleMetadata({
      imports: [
        UnderConstructionModule,
        HttpClientModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
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
