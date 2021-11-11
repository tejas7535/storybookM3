import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { HeaderModule } from '@schaeffler/header';
import {
  SidebarComponent,
  SidebarElementsComponent,
  SidebarModule,
} from '@schaeffler/sidebar';

import READMEMd from '../../../../sidebar/README.md';
import { Badges } from '../../../.storybook/storybook-badges.constants';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Deprecated}/Sidebar`,
  component: SidebarComponent,
  decorators: [
    moduleMetadata({
      imports: [
        HeaderModule,
        SidebarModule,
        CommonModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot(),
        RouterTestingModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Deprecated],
  },
} as Meta<SidebarComponent>;

const Template: Story<SidebarComponent> = (args: SidebarComponent) => ({
  component: SidebarComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" toggleEnabled="true">
        <schaeffler-sidebar content>
            <ng-container sidebar>
                SIDEBAR CONTENT
            </ng-container>

            <ng-container content>
                PAGE CONTENT
            </ng-container>
        </schaeffler-sidebar>
    </schaeffler-header>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  width: 300,
};

//TODO: bring back groupings once they're supported by controls
// const elementOneId = 'Sidebar Element 1';
// const elementTwoId = 'Sidebar Element 2';

const TemplateWithSidebarElements: Story<SidebarComponent> = (
  args: SidebarComponent
) => ({
  component: SidebarComponent,
  props: args,
  template: `
    <schaeffler-header platformTitle="Storybook Demo" toggleEnabled="true">
      <schaeffler-sidebar content>
          <ng-container sidebar>
              <schaeffler-sidebar-elements [elements]="elements"></schaeffler-sidebar-elements>
          </ng-container>

          <ng-container content>
              PAGE CONTENT
          </ng-container>
      </schaeffler-sidebar>
    </schaeffler-header>
  `,
});

export const WithSidebarElements = TemplateWithSidebarElements.bind({});
WithSidebarElements.args = {
  elements: [
    {
      text: 'Home',
      link: '/home',
      icon: 'home',
    },
    {
      text: 'Cart',
      link: '/cart',
      icon: 'shopping_cart',
    },
  ],
} as Partial<SidebarComponent & SidebarElementsComponent>;
