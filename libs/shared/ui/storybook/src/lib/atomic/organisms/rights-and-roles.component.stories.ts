import { provideAnimations } from '@angular/platform-browser/animations';
import { Meta, applicationConfig, moduleMetadata } from '@storybook/angular';

import {
  Role,
  RolesAndRightsComponent,
  RolesAndRightsModule,
  RolesGroup,
} from '@schaeffler/roles-and-rights';

import READMEMd from '../../../../../roles-and-rights/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import {
  StorybookTranslocoModule,
  getMultiLanguageStoryTemplate,
} from '../../../../.storybook/storybook-transloco.module';
import { importProvidersFrom } from '@angular/core';

const mockRoles: Role[] = [
  {
    title: 'Role Title 1',
    rights: 'my  first rights',
  },
  {
    title: 'Role Title 2',
    rights: 'my missing rights',
    rightsMissing: true,
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
  {
    title: 'Role Group Title 3',
    roles: mockRoles,
  },
];

const mockMissingRolesGroup: RolesGroup = {
  title: 'Role Group With Missing Roles',
  roles: [],
};

export default {
  title: 'Atomic/Organisms/Roles & Rights',
  component: RolesAndRightsComponent,
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      imports: [RolesAndRightsModule],
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(StorybookTranslocoModule),
        provideAnimations(),
      ],
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

export const HideHeading = getMultiLanguageStoryTemplate.bind({});
HideHeading.args = {
  rolesGroups: mockRolesGroups,
  showHeading: false,
};

export const CustomHeading = getMultiLanguageStoryTemplate.bind({});
CustomHeading.args = {
  headingText: 'My Custom Heading Text',
  rolesGroups: mockRolesGroups,
};

export const MissingRoles = getMultiLanguageStoryTemplate.bind({});
MissingRoles.args = {
  headingText: 'Some Roles are not available',
  rolesGroups: [...mockRolesGroups, mockMissingRolesGroup],
};
