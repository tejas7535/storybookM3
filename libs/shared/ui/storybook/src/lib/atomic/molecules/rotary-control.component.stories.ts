import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import {
  RotaryControlComponent,
  RotaryControlItem,
} from '@schaeffler/controls';

import READMEMd from '../../../../../controls/src/lib/rotary-control/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

const monthsWithNumber = [0, 1, 3, 6, 9, 12];
const duration = 5;
const availableMonths: RotaryControlItem[] = Array.from(
  { length: 13 },
  (_, index) => ({
    label: monthsWithNumber.includes(index) ? index.toString() : '',
    highlight: index === 0,
  })
);

const defaultValue = 4;
const defaultItems: RotaryControlItem[] = Array.from(
  { length: 13 },
  (_, index) => ({
    label: index.toString(),
  })
);

const highlightedValue = 7;
const itemsWithHighlight: RotaryControlItem[] = Array.from(
  { length: 9 },
  (_, index) => ({
    label: index.toString(),
    highlight: index === highlightedValue,
  })
);

export default {
  title: 'Atomic/Molecules/Rotary Control',
  component: RotaryControlComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NoopAnimationsModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
} as Meta<RotaryControlComponent>;

const Template: StoryFn<RotaryControlComponent> = (
  args: RotaryControlComponent
) => ({
  component: RotaryControlComponent,
  props: args,
});

export const Concept1Control = Template.bind({});
Concept1Control.args = {
  controlValue: duration,
  controlItems: availableMonths,
  offsetAngle: 45,
};

export const Default = Template.bind({});
Default.args = {
  controlValue: defaultValue,
  controlItems: defaultItems,
};

export const HighlightedValue = Template.bind({});
HighlightedValue.args = {
  controlValue: highlightedValue,
  controlItems: itemsWithHighlight,
};

export const RotateScale = Template.bind({});
RotateScale.args = {
  controlValue: defaultValue,
  controlItems: defaultItems,
  rotateScale: true,
};

export const ValueChangeable = Template.bind({});
ValueChangeable.args = {
  controlValue: defaultValue,
  controlItems: defaultItems,
  controlValueChangeable: true,
};
