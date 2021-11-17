import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslocoModule } from '@ngneat/transloco';

import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { AppShellComponent } from '@schaeffler/app-shell';

import { UserPanelComponent } from '../../../../../app-shell/src/lib/components/user-panel/user-panel.component';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';
import READMEMd from '../../../../../app-shell/README.md';

interface AppShellStorybookTemplate {
  headerContent?: string;
  sideNavContent?: string;
  mainContent?: string;
  footerContent?: string;
}

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Templates}/App Shell`,
  component: AppShellComponent,
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
  decorators: [
    moduleMetadata({
      declarations: [AppShellComponent, UserPanelComponent],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        RouterTestingModule,
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
} as Meta;

const TemplateDefault: Story<AppShellComponent | AppShellStorybookTemplate> = (
  args
) => ({
  props: args,
  template: `
  <schaeffler-app-shell
    [appTitle]="appTitle"
    [appTitleLink]="appTitleLink"
    [hasSidebarLeft]="hasSidebarLeft"
    [userName]="userName"
    [userImageUrl]="userImageUrl"
  >
    <ng-container headerInlineContent>
      <span>{{ headerContent }}</span>
      <span *ngIf="headerContent" class="w-[1px] ml-1.5 sm:ml-3 h-4 sm:h-7 bg-highEmphasis"></span>
    </ng-container>
    <ng-container sidenavBody>
      <h4>{{ sideNavContent }}</h4>
    </ng-container>
    <ng-container mainContent>
      <div class="h-full w-full text-center">
        <h1>{{ mainContent }}</h1>
      </div>
    </ng-container>
    <ng-container footerContent>
      <span>{{ footerContent }}</span>
    </ng-container>
  </schaeffler-app-shell>
  `,
});

export const Default = TemplateDefault.bind({});
Default.args = {
  appTitle: 'Hello World App',
  appTitleLink: '/',
  hasSidebarLeft: true,
  userName: 'Frank Abagnale junior',
  userImageUrl: '../avatar.png',
  headerContent: 'Hello Header Content',
  sideNavContent: 'Hello Sidenav Content',
  mainContent: 'Hello Main Content',
  hasFooter: true,
  footerContent: 'Hello Footer Content',
  footerLinks: [
    {
      link: '/internal-route',
      title: 'Internal Route',
      external: false,
    },
    {
      link: 'some://external.url.com',
      title: 'External Link Text',
      external: true,
    },
  ],
  footerFixed: true,
  appVersion: '0.0.1',
};
