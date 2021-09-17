import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { Icon, IconsModule } from '@schaeffler/icons';
import {
  SpeedDialFabComponent,
  SpeedDialFabModule,
} from '@schaeffler/speed-dial-fab';

import READMEMd from '../../../speed-dial-fab/README.md';
import { MatIconModule } from '@angular/material/icon';

export default {
  title: 'Components/SpeedDialFabButton',
  component: SpeedDialFabComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SpeedDialFabModule,
        CommonModule,
        MatButtonModule,
        BrowserAnimationsModule,
        IconsModule,
        MatIconModule,
        HttpClientModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<SpeedDialFabComponent>;

const Template: Story<SpeedDialFabComponent> = (
  args: SpeedDialFabComponent
) => ({
  component: SpeedDialFabComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
Primary.argTypes = {
  clicked: { action: 'clicked' },
};

export const CustomButton = Template.bind({});
CustomButton.args = {
  primaryButton: {
    key: 'edit',
    icon: new Icon('icon-draft', false),
    color: 'warn',
    label: true,
    title: 'Edit',
  },
};
CustomButton.argTypes = {
  clicked: { actions: 'clicked' },
};

export const WithSecondaryButtons = Template.bind({});
WithSecondaryButtons.args = {
  open: true,
  primaryButton: {
    key: 'conversation',
    icon: new Icon('icon-bubbles', false),
    color: 'primary',
    label: true,
    title: 'new conversation',
  },
  secondaryButtons: [
    {
      key: 'mail',
      icon: new Icon('icon-mail'),
      color: 'accent',
      label: true,
      title: 'New Mail',
    },
    {
      key: 'phone',
      icon: new Icon('icon-phone', false),
      color: 'accent',
      label: true,
      title: 'New Call',
    },
  ],
};
WithSecondaryButtons.argTypes = {
  clicked: { actions: 'clicked' },
};

export const DisabledSecondaryButtons = Template.bind({});
DisabledSecondaryButtons.args = {
  open: true,
  primaryButton: {
    key: 'edit',
    icon: new Icon('icon-draft', false),
    color: 'primary',
    label: false,
    title: 'Start edit mode',
  },
  secondaryButtons: [
    {
      key: 'save',
      icon: new Icon('icon-disk', false),
      color: 'accent',
      label: false,
      title: 'Save changes',
    },
  ],
  disabled: [false],
};
DisabledSecondaryButtons.argTypes = {
  clicked: { actions: 'clicked' },
};
