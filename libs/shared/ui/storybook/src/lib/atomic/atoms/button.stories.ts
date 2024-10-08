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
    docs: {
      description: {
        story: READMEMd,
      },
    },
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
    <section class="bg-surface p-2">
     <h6 class="text-on-surface">Flat buttons "Filled buttons"</h6>
     <div class="flex flex-row gap-6 py-3">
        <button mat-flat-button>Label</button>
        <button class="secondary-button" mat-flat-button>Secodary</button>
        <button class="tertiary-button" mat-flat-button>Tertiary</button>
         <button mat-flat-button class="tonal-button">
          Tonal
          </button>
        <button mat-flat-button disabled>Label</button>
      </div>
      <h6 class="text-on-surface">Raised buttons "Elevated buttons"</h6>
      <div class="flex flex-row gap-6 py-3">
      <button mat-raised-button >{{ buttonText }}</button>
        <button mat-raised-button class="tonal-button">{{ buttonText }}</button>
        <button mat-raised-button disabled>{{ buttonText }}</button>
      </div>

    <h6 class="text-on-surface">Raised buttons with icon</h6>
      <div class="flex flex-row gap-6 py-3">
      <button mat-raised-button ><mat-icon>add</mat-icon>{{ buttonText }}</button>
        <button mat-raised-button><mat-icon>add</mat-icon>{{ buttonText }}</button>
        <button mat-raised-button disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
      </div>

      <h6 class="text-on-surface">Stroked buttons "Outlined buttons"</h6>
      <div class="flex flex-row gap-6 py-3">
        <button mat-stroked-button>{{ buttonText }}</button>
        <button mat-stroked-button disabled>{{ buttonText }}</button>
      </div>
      <h6 class="text-on-surface">Basic buttons "Text buttons"</h6>
      <div class="flex flex-row gap-6 py-3">
        <button mat-button >{{ buttonText }}</button>
        <button mat-button disabled>{{ buttonText }}</button>
      </div>
      <div>
        <h6 class="text-on-surface">Icon buttons</h6>
        <button mat-icon-button class="icon-button-primary" aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
        <button mat-icon-button aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
        <button mat-icon-button disabled aria-label="Example icon button with a globe icon">
          <mat-icon>public</mat-icon>
        </button>
      </div>
       <h6 class="text-on-surface">Fab buttons</h6>
      <div class="flex flex-row gap-6 py-3">
        <button mat-fab aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
         <button class="secondary-fab" mat-fab aria-label="Example icon button with a menu icon">
            <mat-icon>add</mat-icon>
          </button>

          <button class="tertriary-fab" mat-fab aria-label="Example icon button with a menu icon" >
            <mat-icon>add</mat-icon>
          </button>
        <button mat-fab disabled aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <h6 class="text-on-surface">Mini fab buttons</h6>
      <div class="flex flex-row gap-6 py-3">
        <button mat-mini-fab aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
         <button class="secondary-fab" mat-mini-fab aria-label="Example icon button with a menu icon">
            <mat-icon>add</mat-icon>
          </button>
          <button
            class="tertriary-fab"
            mat-mini-fab
            aria-label="Example icon button with a menu icon"
          >
            <mat-icon>add</mat-icon>
          </button>
        <button mat-mini-fab disabled aria-label="Example icon button with a add icon">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <h6 class="text-on-surface">Extended fab buttons</h6>
      <div  class="flex flex-row gap-6 py-3">
        <button mat-fab extended>
          <mat-icon>edit</mat-icon>
          Primary
        </button>
        <button mat-fab extended class="secondary-fab">
          <mat-icon>edit</mat-icon>
          Secondary
        </button>

        <button mat-fab extended class="tertriary-fab">
          <mat-icon>edit</mat-icon>
          Tertiary
        </button>
      </div>
    </section>
  `,
});

export const Default = Template.bind({});
Default.args = {
  buttonText: 'Button',
};
