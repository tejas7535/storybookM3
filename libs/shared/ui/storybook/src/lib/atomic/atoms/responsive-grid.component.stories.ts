import { Meta, Story } from '@storybook/angular';

import { ForbiddenComponent } from '@schaeffler/empty-states';

import READMEMd from '../../../../../empty-states/src/lib/forbidden/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Atoms}/ResponsiveGrid`,
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
  <div class="mb-4">
    <h5>Material.io responsive grid layout</h5>
    <a 
      class="text-primary"  
      href="https://material.io/design/layout/responsive-layout-grid.html#breakpoints" 
      target="_blank" >https://material.io/design/layout/responsive-layout-grid.html#breakpoints
    </a>
    <p>Adjust the storybook viewports for testing</p>
  </div>
  <div class="grid grid-cols-4 gap-4 sm:grid-cols-8  md:grid-cols-12 md:gap-6 h-full text-center">
    <div class="h-full bg-[#018786] bg-opacity-[0.12]">1</div>
    <div class="h-full bg-[#018786] bg-opacity-[0.12]">2</div>
    <div class="h-full bg-[#018786] bg-opacity-[0.12]">3</div>
    <div class="h-full bg-[#018786] bg-opacity-[0.12]">4</div>

    <div class="hidden sm:grid h-full bg-[#018786] bg-opacity-[0.12]">5</div>
    <div class="hidden sm:grid h-full bg-[#018786] bg-opacity-[0.12]">6</div>
    <div class="hidden sm:grid h-full bg-[#018786] bg-opacity-[0.12]">7</div>
    <div class="hidden sm:grid h-full bg-[#018786] bg-opacity-[0.12]">8</div>

    <div class="hidden md:grid h-full bg-[#018786] bg-opacity-[0.12]">9</div>
    <div class="hidden md:grid h-full bg-[#018786] bg-opacity-[0.12]">10</div>
    <div class="hidden md:grid h-full bg-[#018786] bg-opacity-[0.12]">11</div>
    <div class="hidden md:grid  h-full bg-[#018786] bg-opacity-[0.12]">12</div>
  </div>
`;
export const Default = Template.bind({});
