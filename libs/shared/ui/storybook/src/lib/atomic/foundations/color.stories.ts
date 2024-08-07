import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { MatIconModule } from '@angular/material/icon';
import READMEMd from './color/README.md';
const colors = require('../../../../../styles/src/lib/tailwind/colors');

export default {
  title: 'Atomic/Foundations/Color',
  decorators: [
    withDesign,
    moduleMetadata({
      imports: [MatIconModule],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.InProgress],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=152%3A944',
    },
  },
} as Meta;

const Template: StoryFn = (args) => ({
  props: args,
  template: `
    <section class="bg-background-dark p-4">
      <h4>Foundational colors</h4>
      <div class="mat-elevation-z0 bg-primary"><div class="p-4 pt-[60px]">bg-primary {{colors.primary}}</div></div>      
      <div class="mat-elevation-z0 bg-white"><div class="p-4 pt-[60px]">bg-white {{colors.white}}</div></div>
      <div class="mat-elevation-z0 bg-disabled"><div class="p-4 pt-[60px]">bg-disabled {{colors.disabled}}</div></div>
      <div class="mat-elevation-z0 bg-inactive"><div class="p-4 pt-[60px]">bg-inactive {{colors.inactive}}</div></div>
      <div class="mat-elevation-z0 bg-active text-white-low-emphasis"><div class="p-4 pt-[60px]">bg-active {{colors.active}}</div></div>
      <div class="mat-elevation-z0 bg-default"><div class="p-4 pt-[60px]">bg-default {{colors.default}}</div></div>

      <h4>Text colors</h4>
      <div class="mat-elevation-z0 text-link"><div class="p-4 pt-[60px]">text-link {{colors['text-link']}}</div></div>      
      <div class="mat-elevation-z0 text-low-emphasis"><div class="p-4 pt-[60px]">text-low-emphasis {{colors['low-emphasis']}} </div></div>      
      <div class="mat-elevation-z0 text-medium-emphasis"><div class="p-4 pt-[60px]">text-medium-emphasis {{colors['medium-emphasis']}}</div></div>      
      <div class="mat-elevation-z0 text-high-emphasis"><div class="p-4 pt-[60px]">text-high-emphasis {{colors['high-emphasis']}}</div></div>      
      <div class="mat-elevation-z0 text-white-low-emphasis bg-secondary-900"><div class="p-4 pt-[60px]">text-white-low-emphasis {{colors['white-low-emphasis']}}</div></div>      
      <div class="mat-elevation-z0 text-white-medium-emphasis bg-secondary-900"><div class="p-4 pt-[60px]">text-white-medium-emphasis {{colors['white-medium-emphasis']}}</div></div>      
      <div class="mat-elevation-z0 text-white-high-emphasis bg-secondary-900"><div class="p-4 pt-[60px]">text-white-high-emphasis {{colors['white-high-emphasis']}}</div></div>      

      <h4 class="mt-20">Functional Colors</h4>
      <div class="mat-elevation-z0 bg-secondary border border-info mb-1">
        <div class="p-4 pt-[60px]">border-info {{ colors['info'] }}</div>
      </div>
      <div class="mat-elevation-z0 bg-secondary border border-success mb-1">
        <div class="p-4 pt-[60px]">border-success {{ colors['success'] }}</div>
      </div>
      <div class="mat-elevation-z0 bg-secondary border border-warning mb-1">
        <div class="p-4 pt-[60px]">border-warning {{ colors['warning'] }}</div>    
      </div>
      <div class="mat-elevation-z0 bg-secondary border border-error mb-1">
            <div class="p-4 pt-[60px]">border-error {{ colors['error'] }}</div>    
      </div>

      <h4 class="mt-20">Functional Text Colors</h4>
      <div class="mat-elevation-z0 bg-secondary flex flex-row justify-between">
        <div class="p-4 pt-[60px] text-info">text-info {{colors['text-info']}}</div>
        <div class="p-4 pt-[60px] text-success">text-success {{colors['text-success']}}</div>
        <div class="p-4 pt-[60px] text-warning">text-warning {{colors['text-warning']}}</div>
        <div class="p-4 pt-[60px] text-error">text-error {{colors['text-error']}}</div>
      </div>

      <h4 class="mt-20">Text Icon Colors</h4>
      <div class="mat-elevation-z0 bg-secondary">
        <div class="p-4 pt-[60px] flex gap-4 text-icon-link">
          <mat-icon>link</mat-icon>
          <span>text-icon-link</span>
          <span>{{colors.link}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-success">
          <mat-icon>done</mat-icon>
          <span>text-icon-success</span>
          <span>{{colors.success}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-info">
          <mat-icon>info</mat-icon>
          <span>text-icon-info</span>
          <span>{{colors.info}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-warning">
          <mat-icon>warning</mat-icon>
          <span>text-icon-warning</span>
          <span>{{colors.warning}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-error">
          <mat-icon>error</mat-icon>
          <span>text-icon-error</span>
          <span>{{colors.error}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-disabled">
          <mat-icon>edit-off</mat-icon>
          <span>text-icon-disabled</span>
          <span>{{colors.disabled}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-inactive">
          <mat-icon>toggle_off</mat-icon>
          <span>text-icon-inactive</span>
          <span>{{colors.inactive}}</span>
        </div>
        <div class="p-4 pt-[60px] flex gap-4 text-icon-active">
        <mat-icon>toggle_on</mat-icon>
          <span>text-icon-active</span>
          <span>{{colors.active}}</span>
        </div>
      </div>

      <h4 class="mt-20">Color Schema</h4>
      <div class="mat-elevation-z0 bg-primary-variant"><div class="p-4 pt-[60px]">bg-primary-variant {{colors['primary-variant']}} (called secondary-variant in design)</div></div>      
      <div class="mat-elevation-z0 bg-secondary"><div class="p-4 pt-[60px]">bg-secondary {{colors.secondary}} (called primary in design)</div></div>
      <div class="mat-elevation-z0 bg-secondary-variant"><div class="p-4 pt-[60px]">bg-secondary-variant {{colors['secondary-variant']}} (called primary-variant in design)</div></div>
      <div class="mat-elevation-z0 bg-secondary-900 text-white-low-emphasis"><div class="p-4 pt-[60px]">bg-secondary-900 {{colors['secondary-900']}} (called grey/900 in design)</div></div>
      <div class="mat-elevation-z0 bg-background-dark"><div class="p-4 pt-[60px]">bg-background-dark {{colors['background-dark']}}</div></div>
      <div class="mat-elevation-z0 bg-surface"><div class="p-4 pt-[60px]">bg-surface {{colors.surface}}</div></div>
      <div class="mat-elevation-z0 bg-success"><div class="p-4 pt-[60px]">bg-success {{colors['bg-success']}}</div></div>
      <div class="mat-elevation-z0 bg-info"><div class="p-4 pt-[60px]">bg-info {{colors['bg-info']}}</div></div>
      <div class="mat-elevation-z0 bg-warning"><div class="p-4 pt-[60px]">bg-warning {{colors['bg-warning']}}</div></div>
      <div class="mat-elevation-z0 bg-error"><div class="p-4 pt-[60px]">bg-error {{colors['bg-error']}}</div></div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  colors,
};
