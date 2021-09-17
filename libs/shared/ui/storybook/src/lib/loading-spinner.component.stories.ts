import { CommonModule } from '@angular/common';

import {
  LoadingSpinnerComponent,
  LoadingSpinnerModule,
} from '@schaeffler/loading-spinner';

import READMEMd from '../../../loading-spinner/README.md';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

export default {
  title: 'Components/Loading Spinner',
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
