import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { boolean, object, text } from '@storybook/addon-knobs';

import {
  PictureCardComponent,
  PictureCardModule,
} from '@schaeffler/picture-card';

import READMEMd from '../../../picture-card/README.md';

export default {
  title: 'PictureCard',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

const baseComponent = {
  moduleMetadata: {
    imports: [BrowserAnimationsModule, PictureCardModule],
  },
  component: PictureCardComponent,
};

export const primary = () => ({
  ...baseComponent,
  props: {
    title: text('title', 'Storybook Demo'),
    img: text(
      'img',
      'https://mountingmanager-cae.schaeffler.com/api/Images/peku_unknown.bmp'
    ),
  },
});

export const withAction = () => ({
  ...baseComponent,
  props: {
    title: text('title', 'Storybook Demo'),
    img: text(
      'img',
      'https://mountingmanager-cae.schaeffler.com/api/Images/peku_unknown.bmp'
    ),
    actions: object('actions', [
      {
        text: 'Action',
        disabled: false,
        click: () => {
          console.log('Action clicked');
        },
      },
    ]),
  },
});

export const withContent = () => ({
  ...baseComponent,
  template: `<schaeffler-picture-card
    [title]="title"
    [img]="img"
    [toggleEnabled]="toggleEnabled"
    [hideActionsOnActive]="true"
    [actions]="actions"
  >
    <ng-container select="card-content">
      <p>Here is the content</p>
    </ng-container>
  </schaeffler-picture-card>`,
  props: {
    title: text('title', 'Storybook Demo'),
    img: text(
      'img',
      'https://mountingmanager-cae.schaeffler.com/api/Images/peku_unknown.bmp'
    ),
    toggleEnabled: boolean('toggleEnabled', true),
    hideActionsOnActive: boolean('hideActionsOnActive', true),
    actions: object('actions', [
      {
        text: 'Toggle',
        disabled: false,
        toggleAction: true,
      },
    ]),
  },
});
