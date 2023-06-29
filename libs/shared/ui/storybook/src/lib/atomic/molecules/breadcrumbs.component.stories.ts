import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';
import READMEMd from '../../../../../breadcrumbs/README.md';

import {
  Breadcrumb,
  BreadcrumbsComponent,
  BreadcrumbsModule,
} from '@schaeffler/breadcrumbs';

import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';

export default {
  title: 'Atomic/Molecules/Breadcrumbs',
  component: BreadcrumbsComponent,
  decorators: [
    moduleMetadata({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        BreadcrumbsModule,
      ],
    }),
    applicationConfig({
      providers: [provideNoopAnimations()],
    }),
  ],
  parameters: {
    badges: [Badges.NeedsRevision],
    docs: {
      description: {
        story: READMEMd,
      },
    },
  },
} as Meta<BreadcrumbsComponent>;

const Template: StoryFn<BreadcrumbsComponent> = (
  args: BreadcrumbsComponent
) => ({
  component: BreadcrumbsComponent,
  props: args,
});

const breadcrumbs: Breadcrumb[] = [
  { label: 'Home', url: '/url', tooltip: 'More homepage information' },
  { label: 'Page 1', url: '/url', tooltip: 'First page after home' },
  { label: 'Page 2', url: '/url', tooltip: '' },
  { label: 'Page 3', url: '/url', tooltip: '' },
  { label: 'Page 4', url: '/url', tooltip: '' },
  { label: 'Page 5', url: '/url', tooltip: 'What a page' },
  { label: 'Page 6', url: '/url', tooltip: 'Almost the last page' },
  { label: 'Page 7', tooltip: '' },
];

export const Primary = Template.bind({});
Primary.args = {
  breadcrumbs,
  truncateAfter: 0,
};
