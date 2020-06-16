import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

import README from '../../README.md';
import { HeaderComponent } from './header.component';
import { HeaderModule } from './header.module';
import { UserMenuModule } from './user-menu/user-menu.module';

const moduleMetadata = {
  imports: [
    HeaderModule,
    CommonModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    UserMenuModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: HeaderComponent,
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'Header',
  parameters: {
    notes: { markdown: README },
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

export const withPageContent = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo">
                <ng-container content>
                  PAGE CONTENT
                </ng-container>
              </schaeffler-header>`,
});
