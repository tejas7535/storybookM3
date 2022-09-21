import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../../../view-toggle/README.md';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { ViewToggle, ViewToggleComponent } from '@schaeffler/view-toggle';
import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Molecules}/View Toggle`,
  component: ViewToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatButtonToggleModule,
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
  props: args,
});

const views: ViewToggle[] = [
  { id: 0, title: 'view1' },
  { id: 1, title: 'view2', disabled: true },
  { id: 2, title: 'view3' },
];

export const Default = Template.bind({});
Default.args = {
  views,
  displayBorderBottom: false,
};
