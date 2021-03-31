import { CommonModule } from '@angular/common';

import { boolean, text } from '@storybook/addon-knobs';

import {
  HorizontalSeparatorComponent,
  HorizontalSeparatorModule,
} from '@schaeffler/horizontal-separator';

import READMEMd from '../../../horizontal-separator/README.md';

const moduleMetadata = {
  imports: [CommonModule, HorizontalSeparatorModule],
};

const baseComponent = {
  moduleMetadata,
  component: HorizontalSeparatorComponent,
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'Horizontal separator',
  parameters: {
    notes: { markdown: READMEMd },
  },
};
export const primary = () => ({
  ...baseComponent,
  props: {
    text: text('Separator text', 'Sample Separator Text'),
    alwaysCentered: boolean('Always center', true),
  },
});
