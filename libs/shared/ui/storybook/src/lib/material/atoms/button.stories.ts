import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from './button/README.md';

export default {
  title: 'Material/Atoms/Button',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatIconModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta;

const Template: Story = () => ({
  template: `
    <section>
      <div class="flex flex-row gap-6 py-3">
        <button mat-raised-button>Button</button>
        <button mat-raised-button color="primary">Button</button>
        <button mat-raised-button disabled>disabled</button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-raised-button><mat-icon inline=true>add</mat-icon> Button</button>
        <button mat-raised-button color="primary"><mat-icon inline=true>add</mat-icon> Button</button>
        <button mat-raised-button disabled><mat-icon inline=true>add</mat-icon> disabled</button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-stroked-button>Button</button>
        <button mat-stroked-button color="primary">Button</button>
        <button mat-stroked-button disabled>disabled</button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-button>Button</button>
        <button mat-button color="primary">Button</button>
        <button mat-button disabled>disabled</button>
      </div> 
      <div>
        <button mat-icon-button aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
        <button mat-icon-button color="primary" aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
        <button mat-icon-button disabled aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
      </div>
      <div class="flex flex-row gap-6 py-3">
        <button mat-fab color="" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-fab color="primary" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-fab disabled aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
      </div> 
      <div class="flex flex-row gap-6 py-3">
        <button mat-mini-fab color="" aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-mini-fab color="primary" aria-label="Example icon button with a add icon">
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
Default.args = {};
