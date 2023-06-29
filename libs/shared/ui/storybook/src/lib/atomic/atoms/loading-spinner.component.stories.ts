import { CommonModule } from '@angular/common';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import {
  LoadingSpinnerComponent,
  LoadingSpinnerModule,
} from '@schaeffler/loading-spinner';

import READMEMd from '../../../../../loading-spinner/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

export default {
  title: 'Atomic/Atoms/Loading Spinner',
  component: LoadingSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, LoadingSpinnerModule],
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
} as Meta<LoadingSpinnerComponent>;

const Template: StoryFn<LoadingSpinnerComponent> = (
  args: LoadingSpinnerComponent
) => ({
  component: LoadingSpinnerComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  backgroundColor: '',
  useBearingLoadingSpinner: false,
};
