import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { LabelValue, LabelValueModule } from '@schaeffler/label-value';

import READMEMd from '../../../../../../label-value/README.md';
import { Badges } from '../../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../../.storybook/storybook-navigation.constants';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

const mockLabelValuesSingle: LabelValue[] = [
  {
    label: 'Data Label',
    value: 'This is the data value',
  },
  {
    label: 'Data label with Hint',
    labelHint: 'This is some additional explanation in a tooltip',
    value: 'This data needs additional explanation in a tooltip',
  },
  {
    label: 'Longer data label to stretch the label area',
    value: 'This is another and even longer data value string.',
  },
  {
    label: 'Erroneous Data',
    value: 'There is something wrong with this data',
    valueAdditionalClass: 'text-error',
  },
  {
    label: 'WIP',
    value: 'This is some seriously important data value',
    valueAdditionalClass: 'text-link',
  },
];

const mockLabelValuesMultiple: LabelValue[] = [
  {
    label: 'Data Set with multiple values',
    values: [
      {
        valueText: 'This is the first data value',
      },
      {
        valueText: 'This is the second, a little longer data value',
      },
      {
        valueText: 'Short value',
      },
    ],
  },
  {
    label: 'Data Set with some colored values',
    values: [
      {
        valueText: 'No color data value',
      },
      {
        valueText: 'something wrong',
        valueAdditionalClass: 'text-error',
      },
      {
        valueText: 'Super',
        valueAdditionalClass: 'text-link',
      },
    ],
  },
];

const mockLabelValuesHtml: LabelValue[] = [
  {
    label: 'Data Label',
    value: 'This is the data value',
  },
  {
    label: 'This is a HTML row',
    custom: {
      selector: 'htmlrow',
      data: {
        text: "Click me, I'm *****!",
      },
    },
  },
];

@Component({
  selector: 'tabs-component-example',
  template: `
    <schaeffler-label-value
      [labelValues]="labelValues"
      [labelMinWidth]="labelMinWidth"
      [LabelMaxWidth]="LabelMaxWidth"
    >
      <ng-template #custom let-row="row" let-data="data">
        <div *ngIf="row === 'htmlrow'">
          <button mat-raised-button color="primary">{{ data.text }}</button>
        </div>
      </ng-template>
    </schaeffler-label-value>
  `,
})
class LabelValueExampleComponent {}

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Label Value`,
  component: LabelValueExampleComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
  decorators: [
    moduleMetadata({
      imports: [NoopAnimationsModule, LabelValueModule, MatButtonModule],
    }),
  ],
} as Meta<LabelValueExampleComponent>;

const Template: Story<LabelValueExampleComponent> = (
  args: LabelValueExampleComponent
) => ({
  component: LabelValueExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  labelValues: mockLabelValuesSingle,
};

export const LabelMinWidth = Template.bind({});
LabelMinWidth.args = {
  labelValues: mockLabelValuesSingle,
  labelMinWidth: 300,
};

export const LabelMaxWidth = Template.bind({});
LabelMaxWidth.args = {
  labelValues: mockLabelValuesSingle,
  labelMaxWidth: 120,
};

export const MultipleValues = Template.bind({});
MultipleValues.args = {
  labelValues: mockLabelValuesMultiple,
};

export const HtmlValues = Template.bind({});
HtmlValues.args = {
  labelValues: mockLabelValuesHtml,
};
