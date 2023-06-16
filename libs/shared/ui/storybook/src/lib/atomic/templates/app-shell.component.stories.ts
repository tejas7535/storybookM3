import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslocoModule } from '@ngneat/transloco';

import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';

import { AppShellComponent } from '@schaeffler/app-shell';

import { UserPanelComponent } from '../../../../../app-shell/src/lib/components/user-panel/user-panel.component';
import { Badges } from '../../../../.storybook/storybook-badges.constants';

import { StorybookTranslocoModule } from '../../../../.storybook/storybook-transloco.module';
import READMEMd from '../../../../../app-shell/README.md';

interface AppShellStorybookTemplate {
  headerContent?: string;
  sideNavContent?: string;
  mainContent?: string;
  mainContentText: string;
  mainContentParagraphs: string[];
  footerContent?: string;
}

export default {
  title: 'Atomic/Templates/App Shell',
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

const TemplateDefault: StoryFn<
  AppShellComponent | AppShellStorybookTemplate
> = (args) => ({
  props: args,
  template: `
  <schaeffler-app-shell
    [appTitle]="appTitle"
    [appTitleLink]="appTitleLink"
    [hasSidebarLeft]="hasSidebarLeft"
    [userName]="userName"
    [userImageUrl]="userImageUrl"
    [hasFooter]="hasFooter"
    [footerLinks]="footerLinks"
    [footerFixed]="footerFixed"
    [appVersion]="appVersion"
  >
    <ng-container headerInlineContent>
      <span class="rounded bg-gradient-to-br from-primary-variant to-surface border border-primary px-3 py-1">{{ headerContent }}</span>
    </ng-container>
    <ng-container sidenavBody>
      <div class="rounded bg-gradient-to-br from-primary-variant to-surface border border-primary px-3 py-1 m-2">{{ sideNavContent }}</div>
    </ng-container>
    <ng-container mainContent>
      <div class="h-full w-full">
        <h1 class="px-3">{{ mainContent }}</h1>
        <div class="px-3 py-8">
          <button mat-stroked-button color="primary" class="!mr-3" (click)="mainContentParagraphs.push(mainContentText)">Add more content</button>
          <button mat-stroked-button (click)="mainContentParagraphs.length = 0">Reset content</button>
          <div *ngFor="let paragraph of mainContentParagraphs" class="py-4 text-h3">{{ paragraph }}</div>
        </div>
      </div>
    </ng-container>
    <ng-container footerContent>
      <span class="rounded bg-gradient-to-br from-primary-variant to-surface border border-primary px-3 py-1">{{ footerContent }}</span>
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
  mainContentText:
    'Qapla. Dah tlhingan hol mu ghom a dalegh. Qawhaqvam chenmohlu di wiqipe diya ohvad ponglu. Ach jinmolvamvad Saghbe law tlhingan hol, dis, oh mevmohlu. Ach dis jar wa mahcha dich wikia jinmoldaq vihta. Hov lengvad chenmohlu tlhingan hol e ej dah oh ghojtah ghot law.',
  mainContentParagraphs: [],
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
