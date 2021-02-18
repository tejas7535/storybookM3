import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { text } from '@storybook/addon-knobs';

import {
  FooterTailwindComponent,
  FooterTailwindModule,
} from '@schaeffler/footer-tailwind';

import READMEMd from '../../../footer/README.md';

const moduleMetadata = {
  imports: [
    CommonModule,
    FooterTailwindModule,
    RouterModule.forRoot([{ path: '**', redirectTo: '/', pathMatch: 'full' }]),
    MatIconModule,
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
};

const baseComponent = {
  moduleMetadata,
  component: FooterTailwindComponent,
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'Footer (using Tailwind)',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

const externalGroupId = 'External Link';
const internalGroupId = 'Internal Link';

export const primary = () => ({
  ...baseComponent,
  props: {
    footerLinks: [
      {
        link: text('link', '/data -security', internalGroupId),
        title: text('title', 'Data Security', internalGroupId),
        external: false,
      },
      {
        link: text('link', 'https://www.schaeffler.com', externalGroupId),
        title: text('title', 'Schaefffler Homepage', externalGroupId),
        external: true,
      },
    ],
    appVersion: '0.0.1',
  },
});
