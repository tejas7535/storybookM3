import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';
import { text } from '@storybook/addon-knobs';

import {
  UnderConstructionComponent,
  UnderConstructionModule,
} from '@schaeffler/empty-states';
import { StorybookTranslocoModule } from '@schaeffler/transloco';

import READMEMd from '../../../empty-states/src/lib/under-construction/README.md';

const moduleMetadata = {
  imports: [
    UnderConstructionModule,
    HttpClientModule,
    StorybookTranslocoModule,
    TranslocoModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: UnderConstructionComponent,
};

export default {
  title: 'Under Construction',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
});

export const withCustomText = () => ({
  ...baseComponent,
  props: {
    title: text('title', 'Incoming feature!'),
    message: text('message', 'This feature will come soon.'),
  },
});
