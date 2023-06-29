import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewToggle, ViewToggleComponent } from '@schaeffler/view-toggle';
import READMEMd from '../../../../../view-toggle/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Atomic/Molecules/View Toggle',
  component: ViewToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, MatButtonToggleModule, MatIconModule],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.InProgress],
  },
} as Meta<ViewToggleComponent>;

const Template: StoryFn<ViewToggleComponent> = (args: ViewToggleComponent) => ({
  component: ViewToggleComponent,
  props: { ...args, iconClicked: action('iconClicked') },
});

const views: ViewToggle[] = [
  {
    id: 0,
    title: 'view1',
    active: true,
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
    active: false,
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
    active: false,
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
    active: false,
  },
  {
    id: 4,
    active: false,
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
    active: false,
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
