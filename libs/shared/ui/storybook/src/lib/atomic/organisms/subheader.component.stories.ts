import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderComponent, SubheaderModule } from '@schaeffler/subheader';

import READMEMd from '../../../../../subheader/README.md';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Subheader`,
  component: SubheaderComponent,
  decorators: [
    moduleMetadata({
      imports: [
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
    badges: [Badges.NeedsRevision],
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
