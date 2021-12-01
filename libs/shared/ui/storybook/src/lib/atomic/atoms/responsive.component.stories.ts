import { Meta, Story } from '@storybook/angular';

import { ForbiddenComponent } from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/forbidden/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Atoms}/Responsive`,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<ForbiddenComponent>;

const Template: Story = (args) => ({
  props: args,
  template,
});

const template = `
  <div class="bg-background p-4">
    <h5>Documentation of responsive breakpoints</h5>
    <div class="my-4">
      <div class="w-[1920px] p-2 mat-elevation-z2 bg-white">
        <p>Default</p>
      </div>
      <div class="ml-[600px] w-[1320px] m-1 p-2 mat-elevation-z2 bg-white">
        SM
      </div>
      <div class="ml-[904px] w-[1016px] p-2 mat-elevation-z2 bg-white">
        MD
      </div>
      <div class="ml-[1239px] w-[681px] m-1 p-2 mat-elevation-z2 bg-white">
        LG
      </div>
      <div class="ml-[1439px] w-[481px] p-2 mat-elevation-z2 bg-white">
        XL
      </div>
    </div>
    <div class="flex flex-row h-[250px] w-[1920px] bg-white  text-center">
      <div class="w-[600px] mat-elevation-z2 h-full p-4">
      <p class="text-center">0-600px<p>
      Mobile<br>
      </div>
      <div class="w-[304px] mat-elevation-z2 h-full p-4">
      <p class="text-center">600-904px<p>
      Tablet Small
      </div>
      <div class="w-[335px] mat-elevation-z2 h-full p-4">
      <p class="text-center">905-1239px<p>
      Tablet Large
      </div>
      <div class="w-[200px] mat-elevation-z2 h-full p-4">
      <p class="text-center">1240-1439px<p>
      Laptop
      </div>
      <div class="w-[481px] mat-elevation-z2 h-full p-4">
      <p class="text-center">1440-1920px<p>
      Desktop
      </div>
    </div>
  </div>
`;

export const Default = Template.bind({});
