import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { Badges } from '../../../../../.storybook/storybook-badges.constants';
import READMEMd from './README.md';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'expansion-panel-example',
  template: `
    <mat-accordion [multi]="accordion">
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
})
class ExpansionPanelExampleComponent {
  @Input() public accordion?: boolean = false;
}

export default {
  title: 'Atomic/Molecules/ExpansionPanel',
  component: ExpansionPanelExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [MatExpansionModule],
    }),
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
  },
} as Meta<ExpansionPanelExampleComponent>;

const Template: StoryFn<ExpansionPanelExampleComponent> = (
  args: ExpansionPanelExampleComponent
) => ({
  component: ExpansionPanelExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};

export const Accordion = Template.bind({});
Accordion.args = {
  accordion: true,
};
