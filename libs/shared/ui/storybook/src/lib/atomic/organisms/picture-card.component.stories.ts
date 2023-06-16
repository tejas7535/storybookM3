import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import {
  PictureCardComponent,
  PictureCardModule,
} from '@schaeffler/picture-card';

import READMEMd from '../../../../../picture-card/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

export default {
  title: 'Atomic/Organisms/PictureCard',
  component: PictureCardComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, PictureCardModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<PictureCardComponent>;

const Template: StoryFn<PictureCardComponent> = (
  args: PictureCardComponent
) => ({
  component: PictureCardComponent,
  props: args,
  template: `
    <div style="width: 400px">
      <schaeffler-picture-card
        [title]="title"
        [img]="img"
      ></schaeffler-picture-card>
    </div>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  title: 'Storybook Demo',
  img: 'https://mountingmanager-cae.schaeffler.com/api/Images/peku_unknown.bmp',
};

const TemplateWithAction: StoryFn<PictureCardComponent> = (
  args: PictureCardComponent
) => ({
  component: PictureCardComponent,
  props: args,
  template: `
    <div style="width: 400px">
      <schaeffler-picture-card
        [title]="title"
        [img]="img"
        [actions]="actions"
      ></schaeffler-picture-card>
    </div>
  `,
});

export const WithAction = TemplateWithAction.bind({});
WithAction.args = {
  title: 'Storybook Demo',
  img: 'https://mountingmanager-cae.schaeffler.com/api/Images/peku_unknown.bmp',
  actions: [
    {
      text: 'Action',
      disabled: false,
      click: () => {
        console.log('Action clicked');
      },
    },
  ],
};

const TemplateWithContent: StoryFn<PictureCardComponent> = (
  args: PictureCardComponent
) => ({
  component: PictureCardComponent,
  props: args,
  template: `
    <div style="width: 400px">
      <schaeffler-picture-card
        [title]="title"
        [img]="img"
        [toggleEnabled]="toggleEnabled"
        [hideActionsOnActive]="true"
        [actions]="actions"
      >
        <ng-container card-content>
          <p>Here is the content</p>
        </ng-container>
      </schaeffler-picture-card>
    </div>
  `,
});

export const WithContent = TemplateWithContent.bind({});
WithContent.args = {
  title: 'Storybook Demo',
  img: 'https://mountingmanager-cae.schaeffler.com/api/Images/peku_unknown.bmp',
  hideActionsOnActive: true,
  actions: [
    {
      text: 'Toggle',
      disabled: false,
      toggleAction: true,
    },
  ],
};
