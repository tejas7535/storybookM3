import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { Badges } from '../../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../../.storybook/storybook-navigation.constants';
import READMEMd from './README.md';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'expansion-panel-example',
  template: `
    <mat-accordion>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> This is the expansion title No. 1 </mat-panel-title>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel No. 1.</p>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> This is the expansion title No. 2 </mat-panel-title>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel No. 2.</p>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title> This is the expansion title No. 3 </mat-panel-title>
        </mat-expansion-panel-header>
        <p>This is the primary content of the panel No. 3.</p>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styleUrls: ['./expansion-panel.scss'],
})
class ExpansionPanelExampleComponent {}

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/ExpansionPanel`,
  component: ExpansionPanelExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserModule, BrowserAnimationsModule, MatExpansionModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
} as Meta<ExpansionPanelExampleComponent>;

const Template: Story<ExpansionPanelExampleComponent> = (
  args: ExpansionPanelExampleComponent
) => ({
  component: ExpansionPanelExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
