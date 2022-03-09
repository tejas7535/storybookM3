import { MatIconModule } from '@angular/material/icon';

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import READMEMd from './input/README.md';
import { MatInputModule } from '@angular/material/input';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Input`,
  decorators: [
    moduleMetadata({
      imports: [MatInputModule, MatIconModule],
    }),
    withDesign,
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.InProgress],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=7567%3A206625',
    },
  },
} as Meta;

const Template: Story = (args) => ({
  props: args,
  template: `
    <section>
        <div class="flex flex-row gap-6 py-3">
            <mat-form-field class="example-full-width" appearance="fill">
                <mat-label>{{ label }}</mat-label>
                <input matInput [placeholder]="placeholder" value="">
                <mat-hint align="start">{{ hint }}</mat-hint>
            </mat-form-field>
        </div>
        <div class="flex flex-row gap-6 py-3">
            <mat-form-field class="example-full-width" appearance="outline">
                <mat-label>{{ label }}</mat-label>
                <input matInput [placeholder]="placeholder" value="">
                <mat-hint align="start">{{ hint }}</mat-hint>
            </mat-form-field>
        </div>     
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  label: 'This is a label',
  placeholder: 'This is a placeholder',
  hint: 'This is a hint',
};
