import { CommonModule } from '@angular/common';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  LoadingSpinnerComponent,
  LoadingSpinnerModule,
} from '@schaeffler/loading-spinner';

import READMEMd from '../../../../../loading-spinner/README.md';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Atoms}/Loading Spinner`,
  component: LoadingSpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, LoadingSpinnerModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
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
