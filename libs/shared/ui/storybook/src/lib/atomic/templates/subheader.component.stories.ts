import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { Breadcrumb, BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SubheaderComponent, SubheaderModule } from '@schaeffler/subheader';

import READMEMd from '../../../../../subheader/README.md';
import { Badges } from 'libs/shared/ui/storybook/.storybook/storybook-badges.constants';
import { importProvidersFrom } from '@angular/core';

interface SubheaderStorybookTemplate {
  subheaderTitleContent?: string;
  subheaderInlineContent?: string;
  subheaderBlockContent?: string;
}

export default {
  title: 'Atomic/Templates/Subheader',
  component: SubheaderComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SubheaderModule, BreadcrumbsModule],
      providers: [{ provide: APP_BASE_HREF, useValue: 'base' }],
    }),
    applicationConfig({
      providers: [
        provideNoopAnimations(),
        importProvidersFrom(
          RouterModule.forRoot([
            { path: 'base', component: SubheaderComponent },
          ])
        ),
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
} as Meta<SubheaderComponent>;

const Template: StoryFn<SubheaderComponent | SubheaderStorybookTemplate> = (
  args
) => ({
  component: SubheaderComponent,
  props: args,
  template: `
    <schaeffler-subheader
      [showBackButton]="showBackButton"
      [subheaderTitle]="subheaderTitle"
      [breadcrumbs]="breadcrumbs"
      [truncateBreadcrumbsAfter]="truncateBreadcrumbsAfter"
      [hideLine]="hideLine"
      [breakTitle]="breakTitle"
    >
      <ng-container subheaderTitleContent>
        <div class="flex flex-col justify-center px-2">
          <span *ngIf="subheaderTitleContent" class="rounded bg-gradient-to-br from-primary-variant to-surface border border-primary px-3 py-1 text-caption">{{ subheaderTitleContent }}</span>
        </div>
      </ng-container>
      <ng-container subheaderInlineContent>
        <span *ngIf="subheaderInlineContent" class="rounded bg-gradient-to-br from-primary-variant to-surface border border-primary px-3 py-1 text-button">{{ subheaderInlineContent }}</span>
      </ng-container>
      <ng-container subheaderBlockContent>
        <div *ngIf="subheaderBlockContent" class="rounded bg-gradient-to-br from-primary-variant to-surface border border-primary p-4">{{ subheaderBlockContent }}</div>
      </ng-container>
    </schaeffler-subheader>
  `,
});

const breadcrumbs: Breadcrumb[] = [
  { label: 'Home', url: '/url', tooltip: 'More homepage information' },
  { label: 'Page 1', url: '/url', tooltip: 'First page after home' },
  { label: 'Page 2', url: '/url', tooltip: '' },
  { label: 'Page 3', url: '/url', tooltip: '' },
  { label: 'Page 4', url: '/url', tooltip: '' },
  { label: 'Page 5', url: '/url', tooltip: 'What a page' },
  { label: 'Page 6', tooltip: '' },
];

export const Primary = Template.bind({});
Primary.args = {
  showBackButton: true,
  subheaderTitle: 'Title',
  breadcrumbs,
  truncateBreadcrumbsAfter: 0,
  hideLine: false,
  breakTitle: false,
  subheaderTitleContent: 'Title Content',
  subheaderInlineContent: 'Inline Content',
  subheaderBlockContent: 'Subheader Block Content',
};

const TemplateWithStatus: StoryFn<
  SubheaderComponent | SubheaderStorybookTemplate
> = (args) => ({
  component: SubheaderComponent,
  props: args,
  template: `
    <schaeffler-subheader
    [showBackButton]="showBackButton"
    [subheaderTitle]="subheaderTitle"
    [breadcrumbs]="breadcrumbs"
    [truncateBreadcrumbsAfter]="truncateBreadcrumbsAfter"
    [hideLine]="hideLine"
    [breakTitle]="breakTitle"
  >
    <ng-container subheaderStatusIcon>
      <div class="relative h-5 w-5 rounded-full bg-primary bg-opacity-20">
        <div class="absolute top-1 left-1 h-3 w-3 rounded-full bg-primary"></div>
      </div>
    </ng-container>
    <ng-container subheaderBlockContent>
      <span *ngIf="subheaderBlockContent" class="pl-9 pt-2 text-caption text-link">
        {{ subheaderBlockContent }}
      </span>
    </ng-container>
  </schaeffler-subheader>
  `,
});

export const WithStatusIndication = TemplateWithStatus.bind({});
WithStatusIndication.args = {
  showBackButton: true,
  subheaderTitle: 'Title',
  breadcrumbs,
  truncateBreadcrumbsAfter: 0,
  hideLine: false,
  breakTitle: false,
  subheaderBlockContent: 'Synced with SAP',
};
