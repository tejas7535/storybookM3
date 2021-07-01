import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  BreadcrumbsComponent,
  BreadcrumbsModule,
} from '@schaeffler/breadcrumbs';

export default {
  title: 'Breadcrumbs',
  component: BreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [BreadcrumbsModule, MatIconModule, RouterTestingModule],
    }),
  ],
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
