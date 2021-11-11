import { CommonModule } from '@angular/common';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  LoadingSpinnerComponent,
  LoadingSpinnerModule,
} from '@schaeffler/loading-spinner';

import READMEMd from '../../../../loading-spinner/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Components}/Loading Spinner`,
  component: LoadingSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, LoadingSpinnerModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<LoadingSpinnerComponent>;

const Template: Story<LoadingSpinnerComponent> = (
  args: LoadingSpinnerComponent
) => ({
  component: LoadingSpinnerComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  backgroundColor: '',
};
