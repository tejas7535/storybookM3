import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';

import {
  Role,
  RolesAndRightsComponent,
  RolesAndRightsModule,
  RolesGroup,
} from '@schaeffler/roles-and-rights';

import READMEMd from '../../../../../roles-and-rights/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { getMultiLanguageStoryTemplate } from '../../../../.storybook/storybook-transloco.module';

const mockRoles: Role[] = [
  {
    title: 'Role Title 1',
    rights: 'my  first rights',
  },
  {
    title: 'Role Title 2',
    rights: 'my  second rights',
  },
];

const mockRolesGroups: RolesGroup[] = [
  {
    title: 'Role Group Title 1',
    roles: mockRoles,
  },
  {
    title: 'Role Group Title 2',
    roles: mockRoles,
  },
];

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Roles & Rights`,
  component: RolesAndRightsComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.NeedsRevision],
  },
  decorators: [
    moduleMetadata({
      imports: [RolesAndRightsModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<RolesAndRightsModule>;

export const Roles = getMultiLanguageStoryTemplate.bind({});
Roles.args = {
  roles: mockRoles,
};

export const GroupedRoles = getMultiLanguageStoryTemplate.bind({});
GroupedRoles.args = {
  rolesGroups: mockRolesGroups,
};

export const CustomHeading = getMultiLanguageStoryTemplate.bind({});
CustomHeading.args = {
  headingText: 'My Custom Heading Text',
  rolesGroups: mockRolesGroups,
};
