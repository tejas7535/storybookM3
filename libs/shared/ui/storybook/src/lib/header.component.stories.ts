import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule } from '@ngrx/store';
import { UserMenuModule } from 'libs/shared/ui/header/src/lib/user-menu/user-menu.module';

import {
  HeaderComponent,
  HeaderModule,
  UserMenuComponent,
} from '@schaeffler/header';

import READMEMd from '../../../header/README.md';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

export default {
  title: 'Components/Header',
  parameters: {
    backgrounds: {
      default: 'Schaeffler',
      values: [{ name: 'Schaeffler', value: '#dee4e7' }],
    },
    notes: { markdown: READMEMd },
  },
  component: HeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HeaderModule,
        CommonModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        RouterTestingModule,
        UserMenuModule,
      ],
    }),
  ],
} as Meta<HeaderComponent>;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  component: HeaderComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  platformTitle: 'Storybook Demo',
};

export const WithToggle = Template.bind({});
WithToggle.args = {
  platformTitle: 'Storybook Demo',
  toggleEnabled: true,
};
WithToggle.argTypes = {
  toggle: { action: 'toggle' },
};

const TemplateWithUserName: Story<HeaderComponent> = (
  args: HeaderComponent
) => ({
  component: HeaderComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo">
      <schaeffler-user-menu
          user-menu
          [user]="userName"
      ></schaeffler-user-menu>
    </schaeffler-header>
  `,
});

export const WithUserName = TemplateWithUserName.bind({});
WithUserName.args = {
  platformTitle: 'Storybook Demo',
  userName: 'User Name',
} as Partial<HeaderComponent & UserMenuComponent>;

const TemplateWithUserMenu: Story<HeaderComponent> = (
  args: HeaderComponent
) => ({
  component: HeaderComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo">
      <schaeffler-user-menu
          user-menu
          [user]="userName"
          [entries]="menuEntries"
          (clicked)="clicked($event)"
      ></schaeffler-user-menu>
    </schaeffler-header>
  `,
});

export const WithUserMenu = TemplateWithUserMenu.bind({});
WithUserMenu.args = {
  platformTitle: 'Storybook Demo',
  userName: 'User Name',
  menuEntries: [
    { key: 'profile', label: 'Profile' },
    { key: 'logout', label: 'Logout' },
  ],
} as Partial<HeaderComponent & UserMenuComponent>;

const TemplateWithLink: Story<HeaderComponent> = (args: HeaderComponent) => ({
  component: HeaderComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" [link]="link">
    </schaeffler-header>
  `,
});

export const WithLink = TemplateWithLink.bind({});
WithLink.args = {
  link: '/parentRoute',
};

const TemplateWithPageContent: Story<HeaderComponent> = (
  args: HeaderComponent
) => ({
  component: HeaderComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo">
      <ng-container content>
        PAGE CONTENT
      </ng-container>
    </schaeffler-header>
  `,
});

export const WithPageContent = TemplateWithPageContent.bind({});
WithPageContent.args = {
  platformTitle: 'Storybook Demo',
};

const TemplateWithSecondaryLogo: Story<HeaderComponent> = (
  args: HeaderComponent
) => ({
  component: HeaderComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" logo="../logo-rubix-main.png">
      <ng-container content>
        PAGE CONTENT
      </ng-container>
    </schaeffler-header>
  `,
});

export const WithSecondaryLogo = TemplateWithSecondaryLogo.bind({});
WithSecondaryLogo.args = {
  platformTitle: 'Storybook Demo',
};

const TemplateWithToggleAndSecondaryLogo: Story<HeaderComponent> = (
  args: HeaderComponent
) => ({
  component: HeaderComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" [toggleEnabled]="true" logo="../logo-rubix-main.png">
      <ng-container content>
        PAGE CONTENT
      </ng-container>
    </schaeffler-header>
  `,
});

export const WithToggleAndSecondaryLogo =
  TemplateWithToggleAndSecondaryLogo.bind({});
WithToggleAndSecondaryLogo.args = {
  platformTitle: 'Storybook Demo',
};
