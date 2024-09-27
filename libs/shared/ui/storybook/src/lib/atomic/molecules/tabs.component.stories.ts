import { Component } from '@angular/core';

import { provideAnimations } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './tabs/README.md';
import { MatIconModule } from '@angular/material/icon';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'tabs-component-example',
  template: `
    <div class="grid gap-4 bg-surface-legacy p-4">
      <mat-tab-group mat-stretch-tabs animationDuration="0ms">
        <mat-tab label="First">Content 1</mat-tab>
        <mat-tab label="Second">Content 2</mat-tab>
        <mat-tab label="Third">Content 3</mat-tab>
      </mat-tab-group>

      <mat-tab-group mat-stretch-tabs animationDuration="0ms">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>public</mat-icon>
            Tab
          </ng-template>
          Content 1
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>public</mat-icon>
            Tab
          </ng-template>
          Content 2
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>public</mat-icon>
            Tab
          </ng-template>
          Content 3
        </mat-tab>
      </mat-tab-group>

      <mat-tab-group mat-stretch-tabs animationDuration="0ms">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>public</mat-icon>
          </ng-template>
          Content 1
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>public</mat-icon>
          </ng-template>
          Content 2
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>public</mat-icon>
          </ng-template>
          Content 3
        </mat-tab>
      </mat-tab-group>

      <nav
        mat-tab-nav-bar
        mat-stretch-tabs
        animationDuration="0ms"
        [tabPanel]="tabPanel"
      >
        @for (link of links; track link) {
          <a
            mat-tab-link
            (click)="activeLink = link"
            [active]="activeLink == link"
          >
            {{ link }}
          </a>
        }
      </nav>
      <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
    </div>
  `,
})
class TabsExampleComponent {
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
}

export default {
  title: 'Atomic/Molecules/Tabs',
  component: TabsExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [MatTabsModule, MatIconModule],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
    withDesign,
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=739%3A39934',
    },
  },
} as Meta<TabsExampleComponent>;

const Template: StoryFn<TabsExampleComponent> = (
  args: TabsExampleComponent
) => ({
  component: TabsExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
