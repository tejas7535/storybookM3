import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/under-construction/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Under Construction`,
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

const Template: Story<UnderConstructionComponent> = (
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
