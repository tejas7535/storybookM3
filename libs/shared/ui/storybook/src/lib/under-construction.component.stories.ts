import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';
import { StorybookTranslocoModule } from '@schaeffler/transloco';

import READMEMd from '../../../empty-states/src/lib/under-construction/README.md';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

export default {
  title: 'Under Construction',
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
