import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
        NoopAnimationsModule,
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
  { label: 'Home', url: '/url', tooltip: 'More homepage information' },
  { label: 'Page 1', url: '/url', tooltip: 'First page after home' },
  { label: 'Page 2', url: '/url', tooltip: '' },
  { label: 'Page 3', url: '/url', tooltip: '' },
  { label: 'Page 4', url: '/url', tooltip: '' },
  { label: 'Page 5', url: '/url', tooltip: 'What a page' },
  { label: 'Page 6', tooltip: '' },
];

export const Primary = Template.bind({});
Primary.args = {
  breadcrumbs,
  truncateBreadcrumbsAfter: 0,
};
