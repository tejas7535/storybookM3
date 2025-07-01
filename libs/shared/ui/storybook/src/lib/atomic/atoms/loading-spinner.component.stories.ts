import { CommonModule } from '@angular/common';

import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import {
  LoadingSpinnerComponent,
  LoadingSpinnerModule,
} from '@schaeffler/loading-spinner';

import READMEMd from '../../../../../loading-spinner/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

const meta: Meta<LoadingSpinnerComponent> = {
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
};
export default meta;

type Story = StoryObj<LoadingSpinnerComponent>;

export const Primary: Story = {
  args: {
    useBearingLoadingSpinner: false,
    backgroundColor: '',
  },
};

export const BearingSpinner: Story = {
  args: {
    useBearingLoadingSpinner: true,
    backgroundColor: '',
  },
};
