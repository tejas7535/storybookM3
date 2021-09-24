import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { AppShellComponent } from '@schaeffler/app-shell';

import { UserPanelComponent } from '../../../app-shell/src/lib/components/user-panel/user-panel.component';
import READMEMd from '../../../app-shell/README.md';
import { StorybookTranslocoModule } from '../../.storybook/storybook-transloco.module';

export default {
  component: AppShellComponent,
  decorators: [
    moduleMetadata({
      declarations: [AppShellComponent, UserPanelComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        RouterModule.forRoot([], {
          useHash: true,
        }),
        StorybookTranslocoModule,
        TranslocoModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
      ],
    }),
  ],
  title: 'Components/App Shell',
  parameters: {
    backgrounds: {
      default: 'Schaeffler',
      values: [{ name: 'Schaeffler', value: '#dee4e7' }],
    },
    notes: { markdown: READMEMd },
  },
} as Meta;

const Template: Story<AppShellComponent> = (args) => ({
  props: {
    ...args,
  },
});

const TemplateWithSidenavContent: Story<AppShellComponent> = () => ({
  template: `
  <schaeffler-app-shell
    appTitle="Hello World App"
    [hasSidebarLeft]="true"
  >
    <ng-container sidenavBody>
      <h4>Hello Sidenav Content</h4>
    </ng-container>
  </schaeffler-app-shell>
  `,
});

const TemplateWithHeaderContent: Story<AppShellComponent> = () => ({
  template: `
  <schaeffler-app-shell
    appTitle="Hello This is a Very Long Title App"
    [hasSidebarLeft]="true"
  >
    <ng-container headerInlineContent>
      <span>Hello Header Content</span>
      <span class="w-[1px] ml-1.5 sm:ml-3 h-4 sm:h-7 bg-highEmphasis"></span>
    </ng-container>
  </schaeffler-app-shell>
  `,
});

export const Default = Template.bind({});
Default.args = {
  appTitle: 'Hello This is a Very Long Title App',
};

export const Sidebar = TemplateWithSidenavContent.bind({});

export const SidebarAndUser = Template.bind({});
SidebarAndUser.args = {
  appTitle: 'Hello World App',
  hasSidebarLeft: true,
  userName: 'Frank Abagnale junior',
  userImageUrl: '../avatar.png',
};

export const HeaderContent = TemplateWithHeaderContent.bind({});
