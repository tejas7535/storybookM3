import { CommonModule } from '@angular/common';

import { text } from '@storybook/addon-knobs';

import {
  LoadingSpinnerComponent,
  LoadingSpinnerModule,
} from '@schaeffler/loading-spinner';

import READMEMd from '../../../loading-spinner/README.md';

const moduleMetadata = {
  imports: [CommonModule, LoadingSpinnerModule],
};

const baseComponent = {
  moduleMetadata,
  component: LoadingSpinnerComponent,
};

// eslint-disable-next-line
export default {
  title: 'Loading Spinner',
  parameters: {
    notes: { markdown: READMEMd },
  },
};
export const primary = () => ({
  ...baseComponent,
  props: {
    backgroundColor: text('BackgroundColor', undefined),
  },
});
