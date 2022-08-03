import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import READMEMd from './input/README.md';
import { MatInputModule } from '@angular/material/input';

enum PrefixIcons {
  None = '',
  Check = 'done',
  Heart = 'favorite',
}
enum SuffixIcons {
  None = '',
  Info = 'info',
  Hide = 'visibility_off',
}

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Input`,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, MatInputModule, MatIconModule],
    }),
    withDesign,
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=7567%3A206625',
    },
  },
} as Meta;

const Template: Story = (args) => ({
  props: args,
  template: `
    <section class="mb-8">
      <div class="flex flex-row gap-6 py-3">
        <mat-form-field [ngClass]="{ 'mat-form-field-invalid': errorMessage }" appearance="fill">
          <mat-label *ngIf="label">{{ label }}</mat-label>
          <mat-icon *ngIf="prefixIcon" matPrefix>{{ prefixIcon }}</mat-icon>
          <input matInput [placeholder]="placeholder" value="" [disabled]="disabled">
          <mat-icon *ngIf="suffixIcon" matSuffix>{{ suffixIcon }}</mat-icon>
          <mat-hint [ngClass]="{ 'mat-error': errorMessage }" align="start">{{ errorMessage || hint }}</mat-hint>
        </mat-form-field>
    </div>
    <div class="flex flex-row gap-6 py-3">
      <mat-form-field [ngClass]="{ 'mat-form-field-invalid': errorMessage }" appearance="outline">
        <mat-label *ngIf="label">{{ label }}</mat-label>
        <mat-icon *ngIf="prefixIcon" matPrefix>{{ prefixIcon }}</mat-icon>
        <input matInput [placeholder]="placeholder" value="" [disabled]="disabled">
        <mat-icon *ngIf="suffixIcon" matSuffix>{{ suffixIcon }}</mat-icon>
        <mat-hint [ngClass]="{ 'mat-error': errorMessage }" align="start">{{ errorMessage || hint }}</mat-hint>
      </mat-form-field>
      </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.argTypes = {
  prefixIcon: {
    name: 'Prefix Icon',
    control: {
      type: 'select',
      labels: Object.keys(PrefixIcons),
    },
    options: Object.keys(PrefixIcons),
    mapping: PrefixIcons,
  },
  suffixIcon: {
    name: 'Suffix Icon',
    control: {
      type: 'select',
      labels: Object.keys(SuffixIcons),
    },
    options: Object.keys(SuffixIcons),
    mapping: SuffixIcons,
  },
};
Default.args = {
  label: 'This is a label',
  placeholder: 'This is a placeholder',
  prefixIcon: PrefixIcons.None,
  suffixIcon: SuffixIcons.None,
  hint: 'This is a hint',
  errorMessage: '',
  disabled: false,
};
