import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { HeaderModule } from '@schaeffler/header';
import { SubheaderComponent, SubheaderModule } from '@schaeffler/subheader';

import READMEMd from '../../../../sidebar/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Components}/Subheader`,
  component: SubheaderComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HeaderModule,
        CommonModule,
        SubheaderModule,
        BreadcrumbsModule,
        RouterModule.forRoot([{ path: 'base', component: SubheaderComponent }]),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: 'base' }],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<SubheaderComponent>;

const Template: Story<SubheaderComponent> = (args: SubheaderComponent) => ({
  component: SubheaderComponent,
  props: args,
  template: `
    <schaeffler-subheader
      title="Search Results | 69 Findings"
      [breadcrumbs]="breadcrumbs"
    >
    </schaeffler-subheader>
  `,
});

const breadcrumbs: Breadcrumb[] = [
  {
    label: 'Search',
    url: '/search',
  },
  { label: 'Results (250)' },
];

export const Primary = Template.bind({});
Primary.args = {
  breadcrumbs,
};
