import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import {
  NavigationAtomic,
  NavigationMain,
} from 'libs/shared/ui/storybook/.storybook/storybook-navigation.constants';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './tooltip/README.md';

@Component({
  selector: 'toolip-component-example',
  template: `
    <div class="flex flex-col gap-y-32">
      <div>
        <mat-form-field appearance="fill" class="mr-4 mb-8">
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
          <input matInput [(ngModel)]="message" />
          <mat-hint>
            A long message will demonstrate the maximum width of the tooltip
          </mat-hint>
        </mat-form-field>
      </div>
      <div class="sm:ml-32 text-center sm:text-left">
        <button
          [matTooltip]="message"
          [matTooltipPosition]="horizontalPosition"
          mat-raised-button
        >
          Show Tooltip
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
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Tooltip`,
  component: TooltipExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
      ],
    }),
    withDesign,
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.InProgress],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=749%3A21',
    },
  },
} as Meta<TooltipExampleComponent>;

const Template: Story<TooltipExampleComponent> = (
  args: TooltipExampleComponent
) => ({
  component: TooltipExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
