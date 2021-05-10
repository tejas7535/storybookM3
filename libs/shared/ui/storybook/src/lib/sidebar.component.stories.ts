import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { number, text } from '@storybook/addon-knobs';

import { HeaderModule } from '@schaeffler/header';
import { SidebarComponent, SidebarModule } from '@schaeffler/sidebar';

import READMEMd from '../../../sidebar/README.md';

const moduleMetadata = {
  imports: [
    HeaderModule,
    SidebarModule,
    CommonModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    RouterTestingModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: SidebarComponent,
};

// eslint-disable-next-line
export default {
  title: 'Sidebar',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo" toggleEnabled="true">
                <schaeffler-sidebar content>
                    <ng-container sidebar>
                       SIDEBAR CONTENT
                    </ng-container>
                
                    <ng-container content>
                        PAGE CONTENT
                    </ng-container>
                </schaeffler-sidebar>
            </schaeffler-header>`,
  props: {
    width: number('width', 300),
  },
});

const elementOneId = 'Sidebar Element 1';
const elementTwoId = 'Sidebar Element 2';

export const withSidebarElements = () => ({
  ...baseComponent,
  template: `<schaeffler-header platformTitle="Storybook Demo" toggleEnabled="true">
                <schaeffler-sidebar content>
                    <ng-container sidebar>
                        <schaeffler-sidebar-elements [elements]="elements"></schaeffler-sidebar-elements>
                    </ng-container>
                
                    <ng-container content>
                        PAGE CONTENT
                    </ng-container>
                </schaeffler-sidebar>
            </schaeffler-header>`,
  props: {
    elements: [
      {
        text: text('text', 'Home', elementOneId),
        link: text('link', '/home', elementOneId),
        icon: {
          icon: text('icon', 'icon-house', elementOneId),
          materialIcon: false,
        },
      },
      {
        text: text('text', 'Cart', elementTwoId),
        link: text('link', '/cart', elementTwoId),
        icon: {
          icon: text('icon', 'icon-cart', elementTwoId),
          materialIcon: false,
        },
      },
    ],
  },
});
