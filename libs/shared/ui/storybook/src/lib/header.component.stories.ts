import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { UserMenuModule } from 'libs/shared/ui/header/src/lib/user-menu/user-menu.module';

import { HeaderComponent, HeaderModule } from '@schaeffler/header';

import READMEMd from '../../../header/README.md';
import { RouterTestingModule } from '@angular/router/testing';

const moduleMetadata = {
  imports: [
    HeaderModule,
    CommonModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    RouterTestingModule,
    UserMenuModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: HeaderComponent,
};

// eslint-disable-next-line
export default {
  title: 'Header',
  parameters: {
    backgrounds: {
      default: 'Schaeffler',
      values: [{ name: 'Schaeffler', value: '#dee4e7' }],
    },
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
  props: {
    platformTitle: text('platformTitle', 'Storybook Demo'),
  },
});

export const withToggle = () => ({
  ...baseComponent,
  props: {
    platformTitle: text('platformTitle', 'Storybook Demo'),
    toggleEnabled: boolean('toggleEnabled', true),
    toggle: action('toggle'),
  },
});

export const withUserName = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo">
                <schaeffler-user-menu 
                    user-menu 
                    [user]="userName"
                ></schaeffler-user-menu> 
                </schaeffler-header>`,
  props: {
    userName: text('userName', 'User Name'),
  },
});

export const withUserMenu = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo">
                <schaeffler-user-menu
                    user-menu 
                    [user]="userName"
                    [entries]="menuEntries"
                    (clicked)="clicked($event)"
                ></schaeffler-user-menu> 
                </schaeffler-header>`,
  props: {
    userName: text('userName', 'User Name'),
    menuEntries: [
      { key: text('key1', 'profile'), label: text('label1', 'Profile') },
      { key: text('key2', 'logout'), label: text('label2', 'Logout') },
    ],
    clicked: action('clicked'),
  },
});

export const withLink = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo" [link]="link">
                </schaeffler-header>`,
  props: {
    link: text('link', '/parentRoute'),
  },
});

export const withPageContent = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo">
                <ng-container content>
                  PAGE CONTENT
                </ng-container>
              </schaeffler-header>`,
});
