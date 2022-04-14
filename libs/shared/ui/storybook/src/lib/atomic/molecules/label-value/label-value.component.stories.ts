import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  LabelValue,
  LabelValueModule,
  LabelValueComponent,
} from '@schaeffler/label-value';

import READMEMd from '../../../../../../label-value/README.md';
import { Badges } from '../../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../../.storybook/storybook-navigation.constants';

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
    valueTextClass: 'error',
  },
  {
    label: 'WIP',
    value: 'This is some seriously important data value',
    valueTextClass: 'link',
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
        valueTextClass: 'error',
      },
      {
        valueText: 'Super',
        valueTextClass: 'link',
      },
    ],
  },
];

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Label Value`,
  component: LabelValueComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
  decorators: [
    moduleMetadata({
      imports: [NoopAnimationsModule, LabelValueModule],
    }),
  ],
} as Meta<LabelValueModule>;

const Template: Story<LabelValueComponent> = (args: LabelValueComponent) => ({
  component: LabelValueComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  labelValues: mockLabelValuesSingle,
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
