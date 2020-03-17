import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

import { SpeedDialFabComponent } from './speed-dial-fab.component';
import { SpeedDialFabModule } from './speed-dial-fab.module';

const moduleMetadata = {
  imports: [
    SpeedDialFabModule,
    CommonModule,
    MatButtonModule,
    BrowserAnimationsModule
  ]
};

const baseComponent = {
  moduleMetadata,
  component: SpeedDialFabComponent
};

// tslint:disable-next-line: no-default-export
export default {
  title: 'SpeedDialFabButton'
};

export const primary = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked')
  }
});

export const customButton = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
    primaryButton: {
      key: text('key', 'edit'),
      icon: text('icon', 'draft'),
      color: text('color', 'warn'),
      label: boolean('label', true),
      title: text('title', 'Edit')
    }
  }
});

export const withSecondaryButtons = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
    open: boolean('open', true),
    primaryButton: {
      key: 'conversation',
      icon: 'bubbles',
      color: 'primary',
      label: true,
      title: 'new conversation'
    },
    secondaryButtons: [
      {
        key: text('key', 'mail', 'button1'),
        icon: text('icon', 'mail', 'button1'),
        color: text('color', 'accent', 'button1'),
        label: boolean('label', true, 'button1'),
        title: text('title', 'New Mail', 'button1')
      },
      {
        key: text('key', 'phone', 'button2'),
        icon: text('icon', 'phone', 'button2'),
        color: text('color', 'accent', 'button2'),
        label: boolean('label', true, 'button2'),
        title: text('title', 'New Call', 'button2')
      }
    ]
  }
});

export const disabledSecondaryButtons = () => ({
  ...baseComponent,
  props: {
    clicked: action('clicked'),
    open: boolean('open', true),
    primaryButton: {
      key: 'edit',
      icon: 'draft',
      color: 'primary',
      label: false,
      title: 'Start edit mode'
    },
    secondaryButtons: [
      {
        key: 'save',
        icon: 'disk',
        color: 'accent',
        label: false,
        title: 'Save changes'
      }
    ],
    disableSecondary: boolean('Disable the secondary button', false)
  }
});
