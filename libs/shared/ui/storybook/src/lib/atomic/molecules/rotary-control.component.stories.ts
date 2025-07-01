import { CommonModule } from '@angular/common';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';

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

const meta: Meta<RotaryControlComponent> = {
  title: 'Atomic/Molecules/Rotary Control',
  component: RotaryControlComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
    }),
    applicationConfig({
      providers: [provideNoopAnimations()],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.NeedsRevision],
  },
};
export default meta;

type Story = StoryObj<RotaryControlComponent>;

export const Concept1Control: Story = {
  args: {
    controlValue: duration,
    controlItems: availableMonths,
    offsetAngle: 45,
  },
};

export const Default: Story = {
  args: {
    controlValue: defaultValue,
    controlItems: defaultItems,
  },
};

export const HighlightedValue: Story = {
  args: {
    controlValue: highlightedValue,
    controlItems: itemsWithHighlight,
  },
};

export const RotateScale: Story = {
  args: {
    controlValue: defaultValue,
    controlItems: defaultItems,
    rotateScale: true,
  },
};

export const ValueChangeable: Story = {
  args: {
    controlValue: defaultValue,
    controlItems: defaultItems,
    controlValueChangeable: true,
  },
};
