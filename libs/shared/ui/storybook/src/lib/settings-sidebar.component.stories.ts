import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

import { HeaderModule } from '@schaeffler/header';
import { IconsModule } from '@schaeffler/icons';
import {
  SettingsSidebarComponent,
  SettingsSidebarModule,
} from '@schaeffler/settings-sidebar';

import READMEMd from '../../../settings-sidebar/README.md';

const moduleMetadata = {
  imports: [
    HeaderModule,
    CommonModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    SettingsSidebarModule,
    IconsModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: SettingsSidebarComponent,
};

// eslint-disable-next-line
export default {
  title: 'Settings Sidebar',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo" [toggleEnabled]="false">
              <schaeffler-settings-sidebar
                [open]="open"
                [openSidebarBtn]="openSidebarBtn"
                [closeSidebarBtn]="closeSidebarBtn"
                [width]="width"
                [triggerBtnIcon]="triggerBtnIcon"
                (openedChange)="openedChange($event)"
              >
                <ng-container container>
                  <div style="height: 500px;">
                    <div>Main Site content</div>
                  </div>
                </ng-container>
                <ng-container sidebar>
                  <p>Settings Sidebar content</p>
                </ng-container>
              </schaeffler-settings-sidebar>
            </schaeffler-header>`,
  props: {
    width: text('width', '300px'),
    open: boolean('open', true),
    openSidebarBtn: boolean('openSidebarBtn', true),
    closeSidebarBtn: boolean('closeSidebarBtn', true),
    triggerBtnIcon: {
      icon: text('icon', 'icon-filter'),
      materialIcon: false,
    },
    openedChange: action('openedChange'),
  },
});

export const contentInput = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo" [toggleEnabled]="false">
              <schaeffler-settings-sidebar>
                <ng-container container>
                  <div style="height:500px;">
                    <div>Main Site content (container)</div>
                  </div>
                </ng-container>
                <ng-container settings-header>
                  <p>settings header (sidebar)</p>
                </ng-container>
                <ng-container sidebar>
                  <p>Settings Sidebar content (sidebar)</p>
                </ng-container>
              </schaeffler-settings-sidebar>
            </schaeffler-header>`,
});
