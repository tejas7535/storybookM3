import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './button/README.md';

export default {
  title: 'Atomic/Atoms/Button',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule],
    }),
    withDesign,
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=707%3A9',
    },
  },
} as Meta;

const Template: StoryFn = (args) => ({
  props: args,
  template: `
    <section>
      <div class="flex flex-row gap-6 py-3">
      <button mat-raised-button color="primary">{{ buttonText }}</button>
        <button mat-raised-button>{{ buttonText }}</button>
        <button mat-raised-button disabled>{{ buttonText }}</button>
      </div>
      <div class="flex flex-row gap-6 py-3">
      <button mat-raised-button color="primary"><mat-icon>add</mat-icon>{{ buttonText }}</button>
        <button mat-raised-button><mat-icon>add</mat-icon>{{ buttonText }}</button>
        <button mat-raised-button disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-stroked-button color="primary">{{ buttonText }}</button>
        <button mat-stroked-button disabled>{{ buttonText }}</button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-button color="primary">{{ buttonText }}</button>
        <button mat-button disabled>{{ buttonText }}</button>
      </div>
      <div>
        <button mat-icon-button color="primary" aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
        <button mat-icon-button aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
        <button mat-icon-button disabled aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-fab color="primary" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-fab color="" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-fab disabled aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-mini-fab color="primary" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-mini-fab color="" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-mini-fab disabled aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
      </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  buttonText: 'Button',
};
