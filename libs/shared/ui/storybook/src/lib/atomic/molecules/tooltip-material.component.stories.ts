import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './tooltip/README.md';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'tooltip-component-example',
  template: `
    <div class="flex flex-col gap-y-32">
      <div class="flex flex-col sm:flex-row">
        <mat-form-field
          subscriptSizing="dynamic"
          appearance="fill"
          class="mr-4 mb-8"
        >
          <mat-label>Tooltip Position</mat-label>
          <mat-select [(value)]="horizontalPosition">
            <mat-option value="below">Below</mat-option>
            <mat-option value="above">Above</mat-option>
            <mat-option value="left">Left</mat-option>
            <mat-option value="right">Right</mat-option>
          </mat-select>
          <mat-hint>Configure the tooltip position</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="fill" class="mr-4 mb-8">
          <mat-label>Message</mat-label>
          <textarea matInput [(ngModel)]="message"></textarea>
          <mat-hint>
            A long message will demonstrate the maximum width of the tooltip
          </mat-hint>
        </mat-form-field>
        <div class="mr-4 mb-4">
          <button
            mat-raised-button
            (click)="tooltip.show()"
            aria-label="Show tooltip on the button at the end of this section"
            class="example-action-button pr-4"
          >
            Show
          </button>
        </div>
        <div>
          <button
            mat-raised-button
            (click)="tooltip.hide()"
            aria-label="Show tooltip on the button at the end of this section"
            class="example-action-button"
          >
            Hide
          </button>
        </div>
      </div>
      <div class="text-center sm:ml-32 sm:text-left">
        <button
          #tooltip="matTooltip"
          (click)="tooltip.toggle()"
          [matTooltip]="message"
          [matTooltipPosition]="horizontalPosition"
          mat-raised-button
        >
          Hover me!
        </button>
      </div>
    </div>
  `,
})
class TooltipExampleComponent {
  horizontalPosition: TooltipPosition = 'above';
  message: string = 'We pioneer motion';
}

export default {
  title: 'Atomic/Molecules/Tooltip',
  component: TooltipExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
      ],
    }),
    withDesign,
    applicationConfig({
      providers: [provideAnimations()],
    }),
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
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=749%3A21',
    },
  },
} as Meta<TooltipExampleComponent>;

const Template: StoryFn<TooltipExampleComponent> = (
  args: TooltipExampleComponent
) => ({
  component: TooltipExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
