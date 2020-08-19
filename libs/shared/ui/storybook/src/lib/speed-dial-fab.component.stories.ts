import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

import { Icon } from '@schaeffler/icons';
import {
  SpeedDialFabComponent,
  SpeedDialFabModule,
} from '@schaeffler/speed-dial-fab';

import READMEMd from '../../../speed-dial-fab/README.md';

const moduleMetadata = {
  imports: [
    SpeedDialFabModule,
    CommonModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
};

const baseComponent = {
  moduleMetadata,
  component: SpeedDialFabComponent,
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'SpeedDialFabButton',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
  },
});

export const customButton = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
    primaryButton: {
      key: text('key', 'edit'),
      icon: new Icon(text('icon', 'icon-draft'), false),
      color: text('color', 'warn'),
      label: boolean('label', true),
      title: text('title', 'Edit'),
    },
  },
});

export const withSecondaryButtons = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
    open: boolean('open', true),
    primaryButton: {
      key: 'conversation',
      icon: new Icon('icon-bubbles', false),
      color: 'primary',
      label: true,
      title: 'new conversation',
    },
    secondaryButtons: [
      {
        key: text('key', 'mail', 'button1'),
        icon: new Icon(text('icon', 'icon-mail', 'button1'), false),
        color: text('color', 'accent', 'button1'),
        label: boolean('label', true, 'button1'),
        title: text('title', 'New Mail', 'button1'),
      },
      {
        key: text('key', 'phone', 'button2'),
        icon: new Icon(text('icon', 'icon-phone', 'button2'), false),
        color: text('color', 'accent', 'button2'),
        label: boolean('label', true, 'button2'),
        title: text('title', 'New Call', 'button2'),
      },
    ],
  },
});

export const disabledSecondaryButtons = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
    open: boolean('open', true),
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
    disableSecondary: boolean('Disable the secondary button', false),
  },
});
