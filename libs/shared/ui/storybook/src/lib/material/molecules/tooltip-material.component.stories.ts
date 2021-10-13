import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import READMEMd from './tooltip/README.md';

@Component({
  selector: 'toolip-component-example',
  template: `
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Tooltip Position</mat-label>
      <mat-select [(value)]="position">
        <mat-option value="below">Below</mat-option>
        <mat-option value="above">Above</mat-option>
        <mat-option value="left">Left</mat-option>
        <mat-option value="right">Right</mat-option>
      </mat-select>
      <mat-hint>Configure the tooltip position</mat-hint>
    </mat-form-field>

    <button
      matTooltip="Info about the action"
      [matTooltipPosition]="'left'"
      data-cy="showInformationToast"
      mat-raised-button
    >
      Show Tooltip
    </button>
  `,
})
class TooltipExampleComponent {
  horizontalPosition: TooltipPosition = 'above';
}

export default {
  title: 'Material/Molecules/Tooltip',
  component: TooltipExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
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
