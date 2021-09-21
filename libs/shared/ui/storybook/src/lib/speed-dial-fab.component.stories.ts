import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { Icon, IconsModule } from '@schaeffler/icons';
import {
  SpeedDialFabComponent,
  SpeedDialFabModule,
} from '@schaeffler/speed-dial-fab';

import READMEMd from '../../../speed-dial-fab/README.md';

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
    icon: new Icon('edit', true),
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
    icon: new Icon('question_answer', true),
    color: 'primary',
    label: true,
    title: 'new conversation',
  },
  secondaryButtons: [
    {
      key: 'mail',
      icon: new Icon('email', true),
      color: 'accent',
      label: true,
      title: 'New Mail',
    },
    {
      key: 'phone',
      icon: new Icon('phone', true),
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
    icon: new Icon('edit', true),
    color: 'primary',
    label: false,
    title: 'Start edit mode',
  },
  secondaryButtons: [
    {
      key: 'save',
      icon: new Icon('save', true),
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
