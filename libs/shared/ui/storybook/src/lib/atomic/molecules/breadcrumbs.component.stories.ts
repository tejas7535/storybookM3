import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import READMEMd from '../../../../../breadcrumbs/README.md';

import {
  BreadcrumbsComponent,
  BreadcrumbsModule,
} from '@schaeffler/breadcrumbs';

import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/Breadcrumbs`,
  component: BreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbsModule, MatIconModule, RouterTestingModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
} as Meta<BreadcrumbsComponent>;

const Template: Story<BreadcrumbsComponent> = (args: BreadcrumbsComponent) => ({
  component: BreadcrumbsComponent,
  props: args,
});

const breadcrumbs = [
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
