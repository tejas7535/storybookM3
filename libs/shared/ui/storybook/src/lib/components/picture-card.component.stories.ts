import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  PictureCardComponent,
  PictureCardModule,
} from '@schaeffler/picture-card';

import READMEMd from '../../../../picture-card/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Components}/PictureCard`,
  component: PictureCardComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, PictureCardModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<PictureCardComponent>;

const Template: Story<PictureCardComponent> = (args: PictureCardComponent) => ({
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

const TemplateWithAction: Story<PictureCardComponent> = (
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

const TemplateWithContent: Story<PictureCardComponent> = (
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
