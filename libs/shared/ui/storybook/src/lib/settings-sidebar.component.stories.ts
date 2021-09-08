import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';

import { HeaderModule } from '@schaeffler/header';
import {
  SettingsSidebarComponent,
  SettingsSidebarModule,
} from '@schaeffler/settings-sidebar';

import READMEMd from '../../../settings-sidebar/README.md';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { RouterModule } from '@angular/router';

export default {
  title: 'Settings Sidebar',
  component: SettingsSidebarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HeaderModule,
        CommonModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        SettingsSidebarModule,
        RouterModule.forRoot([]),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '' }],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<SettingsSidebarComponent>;

const Template: Story<SettingsSidebarComponent> = (
  args: SettingsSidebarComponent
) => ({
  component: SettingsSidebarComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" [toggleEnabled]="false">
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
    </schaeffler-header>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  width: '300px',
  open: true,
  openSidebarBtn: true,
  closeSidebarBtn: true,
  triggerBtnIcon: 'icon-filter',
};
Primary.argTypes = {
  openedChange: { action: 'openedChange' },
};

const TemplateWithContentInput: Story<SettingsSidebarComponent> = (
  args: SettingsSidebarComponent
) => ({
  component: SettingsSidebarComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" [toggleEnabled]="false">
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
    </schaeffler-header>
  `,
});

export const ContentInput = TemplateWithContentInput.bind({});
