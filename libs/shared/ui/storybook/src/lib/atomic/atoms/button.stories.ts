import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './button/README.md';
import { MatCardModule } from '@angular/material/card';

export default {
  title: 'Atomic/Atoms/Button',
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatCardModule, MatIconModule],
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
  <section class="bg-surface text-on-surface p-4 mb-6 text-headline-large rounded-xl">
  <h2 class="text-display-medium mb-6">Buttons</h2>
  <div class="flex flex-col gap-6">
    <a class="text-primary text-body-large underline" href="https://m3.material.io/components/buttons/overview" target="_blank"> See design guideline </a>
      <a class="text-primary text-body-large underline" href="https://www.figma.com/design/jPgVjpKYDTrPu78wev2tdS/%F0%9F%93%9A-Material-3-Design-Kit-%5BLatest-20.09.24%5D?node-id=53923-27457&node-type=instance&t=hsjeeAluIc74Xhh1-0"
      target="_blank"> Find in Figma</a>
  </div>
  <p class="text-body-medium mt-6">Buttons help people take actions, such as sending an email, sharing a document, or liking a comment.</p>
  </section>

  <mat-card appearance="outlined">
  <mat-card-content class="bg-surface rounded-xl">
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
      <div>
        <h6 class="text-on-surface text-body-medium mt-4">Filled buttons (Default for Primary action)</h6>
        <div class="flex flex-col">
            <div class="flex flex-row gap-6 py-3">
              <button mat-flat-button>{{ buttonText }}</button>
              <button mat-flat-button><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
            <div class="flex flex-row gap-6 py-3">
              <button mat-flat-button disabled>{{ buttonText }}</button>
              <button mat-flat-button disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
        </div> 
        <h6 class="text-on-surface text-body-medium mt-12">Text only buttons (Detaulf for Secondary action)</h6>
        <div class="flex flex-col">
            <div class="flex flex-row gap-6 py-3">
              <button mat-button >{{ buttonText }}</button>
              <button mat-button><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
            <div class="flex flex-row gap-6 py-3">
              <button mat-button disabled>{{ buttonText }}</button>
              <button mat-button disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
        </div>
        <h6 class="text-on-surface text-body-medium mt-12">Outlined buttons</h6>
        <div class="flex flex-col">
            <div class="flex flex-row gap-6 py-3">
              <button mat-stroked-button>{{ buttonText }}</button>
              <button mat-stroked-button><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
            <div class="flex flex-row gap-6 py-3">
              <button mat-stroked-button disabled>{{ buttonText }}</button>
              <button mat-stroked-button disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
        </div> 
        <h6 class="text-on-surface text-body-medium mt-12">Elevated buttons</h6>
        <div class="flex flex-col">
            <div class="flex flex-row gap-6 py-3">
              <button mat-raised-button >{{ buttonText }}</button>
              <button mat-raised-button><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
            <div class="flex flex-row gap-6 py-3">
              <button mat-raised-button disabled>{{ buttonText }}</button>
              <button mat-raised-button disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
        </div>
        <h6 class="text-on-surface text-body-medium mt-12">Tonal buttons</h6>
        <div class="flex flex-col">
            <div class="flex flex-row gap-6 py-3">
              <button mat-flat-button class="tonal-button">{{ buttonText }}</button>
              <button mat-flat-button class="tonal-button"><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
            <div class="flex flex-row gap-6 py-3">
              <button mat-flat-button class="tonal-button" disabled>{{ buttonText }}</button>
              <button mat-flat-button class="tonal-button" disabled><mat-icon>add</mat-icon>{{ buttonText }}</button>
            </div>
        </div>  
      </div>
      <div>
        <h6 class="text-on-surface text-body-medium mt-12 md:mt-4 ">FAB (default)</h6>
        <div class="flex flex-row gap-6 py-3">
          <button mat-fab aria-label="Example icon button with an edit icon">
            <mat-icon>edit</mat-icon>
          </button>
            <button class="secondary-fab" mat-fab aria-label="Example icon button with a edit icon">
              <mat-icon>edit</mat-icon>
            </button>

            <button class="tertriary-fab" mat-fab aria-label="Example icon button with a edit icon" >
              <mat-icon>edit</mat-icon>
            </button>
          <button mat-fab disabled aria-label="Example icon button with a edit icon">
            <mat-icon>edit</mat-icon>
          </button>
        </div>

        <h6 class="text-on-surface text-body-medium mt-12">Small FAB</h6>
        <div class="flex flex-row gap-6 py-3">
          <button mat-mini-fab aria-label="Example icon button with a edit icon">
            <mat-icon>edit</mat-icon>
          </button>
            <button class="secondary-fab" mat-mini-fab aria-label="Example icon button with a edit icon">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              class="tertriary-fab"
              mat-mini-fab
              aria-label="Example icon button with a edit icon"
            >
              <mat-icon>edit</mat-icon>
            </button>
          <button mat-mini-fab disabled aria-label="Example icon button with a edit icon">
            <mat-icon>edit</mat-icon>
          </button>
        </div>

        <h6 class="text-on-surface text-body-medium mt-12">Extended FAB</h6>
        <div class="flex flex-row gap-6 py-3">
          <button mat-fab extended>
            <mat-icon>edit</mat-icon>
            {{ buttonText }}
          </button>
          <button mat-fab extended class="secondary-fab">
            <mat-icon>edit</mat-icon>
          {{ buttonText }}
          </button>

          <button mat-fab extended class="tertriary-fab">
            <mat-icon>edit</mat-icon>
            {{ buttonText }}
          </button>
        </div>
      </div>
      <div>
        <h6 class="text-on-surface text-body-medium md:mt-12 lg:mt-4">Icon buttons</h6>
          <button mat-icon-button aria-label="Example icon button with a settings icon">
            <mat-icon>settings</mat-icon>
          </button>
          <button mat-icon-button aria-label="Example icon button with a settings icon">
            <mat-icon class="icon-button-primary">settings</mat-icon>
          </button>
          <button mat-icon-button disabled aria-label="Example icon button with a settings icon">
            <mat-icon>settings</mat-icon>
          </button>
      </div>
    </section>
  </mat-card-content>
  </mat-card>
  `,
});

export const Default = Template.bind({});
Default.args = {
  buttonText: 'Label',
};
