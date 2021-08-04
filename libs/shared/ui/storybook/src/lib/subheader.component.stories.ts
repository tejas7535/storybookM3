import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { object } from '@storybook/addon-knobs';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { HeaderModule } from '@schaeffler/header';
import { SubheaderComponent, SubheaderModule } from '@schaeffler/subheader';

import READMEMd from '../../../sidebar/README.md';

const moduleMetadata = {
  imports: [
    HeaderModule,
    CommonModule,
    SubheaderModule,
    BreadcrumbsModule,
    RouterModule.forRoot([{ path: 'base', component: SubheaderComponent }]),
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: 'base' }],
  component: SubheaderComponent,
};

export default {
  title: 'Subheader',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Search',
    url: '/search',
  },
  { label: 'Results (250)' },
];

const baseComponent = {
  moduleMetadata,
  component: SubheaderComponent,
};

export const primary = () => ({
  ...baseComponent,
  props: {
    breadcrumbs: object('breadcrumbs', breadcrumbs),
  },
  template: `
    <schaeffler-subheader
      title="Search Results | 69 Findings"
      [breadcrumbs]="breadcrumbs"
    >
    </schaeffler-subheader>`,
});
