import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewToggle, ViewToggleComponent } from '@schaeffler/view-toggle';
import READMEMd from '../../../../../view-toggle/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { action } from '@storybook/addon-actions';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/View Toggle`,
  component: ViewToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatButtonToggleModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.InProgress],
  },
} as Meta<ViewToggleComponent>;

const Template: Story<ViewToggleComponent> = (args: ViewToggleComponent) => ({
  component: ViewToggleComponent,
  props: { ...args, iconClicked: action('iconClicked') },
});

const views: ViewToggle[] = [
  {
    id: 0,
    title: 'view1',
    icons: [
      {
        name: 'edit',
      },
      {
        name: 'lock',
      },
      {
        name: 'close',
      },
    ],
  },
  {
    id: 1,
    title: 'view2',
    disabled: true,
    icons: [
      {
        name: 'edit',
        disabled: true,
      },

      {
        name: 'close',
      },
    ],
  },
  {
    id: 2,
    title: 'view3',
    icons: [
      {
        name: 'lock',
      },
      {
        name: 'edit',
        disabled: true,
      },
    ],
  },
  {
    id: 3,
    title: 'view4',
  },
  {
    id: 4,
    icons: [
      {
        name: 'lock',
      },
      {
        name: 'edit',
      },
    ],
  },
  {
    id: 5,
    icons: [
      {
        name: 'add',
      },
    ],
  },
];

export const Default = Template.bind({});
Default.args = {
  views,
  displayBorderBottom: false,
};
