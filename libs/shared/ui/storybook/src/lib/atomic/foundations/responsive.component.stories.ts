import { Meta, Story } from '@storybook/angular';

import { ForbiddenComponent } from '@schaeffler/empty-states';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import READMEMd from './responsive/README.md';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Foundations}/Responsive`,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<ForbiddenComponent>;

const DefaultTemplate: Story = (args) => ({
  props: args,
  template: defaultTemplate,
});
const ResponsiveGridTemplate: Story = (args) => ({
  props: args,
  template: responsiveGridTemplate,
});

const defaultTemplate = `
  <div class="bg-background-dark p-4">
    <h5>Documentation of responsive breakpoints</h5>
    <div class="my-4">
      <div class="w-[1920px] p-2 mat-elevation-z2 bg-surface">
        <p>Default</p>
      </div>
      <div class="ml-[600px] w-[1320px] m-1 p-2 mat-elevation-z2 bg-surface">
        SM
      </div>
      <div class="ml-[904px] w-[1016px] p-2 mat-elevation-z2 bg-surface">
        MD
      </div>
      <div class="ml-[1239px] w-[681px] m-1 p-2 mat-elevation-z2 bg-surface">
        LG
      </div>
      <div class="ml-[1439px] w-[481px] p-2 mat-elevation-z2 bg-surface">
        XL
      </div>
    </div>
    <div class="flex flex-row h-[250px] w-[1920px] bg-surface  text-center">
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

const responsiveGridTemplate = `
<div class="mb-4">
  <h5>Material.io responsive grid layout</h5>
  <a 
    class="text-link"  
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

export const Default = DefaultTemplate.bind({});
export const ReponsiveGrid = ResponsiveGridTemplate.bind({});
