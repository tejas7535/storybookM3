import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { FooterComponent, FooterModule } from '@schaeffler/footer';

import READMEMd from '../../../../footer/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Components}/Footer`,
  component: FooterComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FooterModule,
        RouterModule.forRoot([
          { path: '**', redirectTo: '/', pathMatch: 'full' },
        ]),
        MatIconModule,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<FooterComponent>;

const Template: Story<FooterComponent> = (args: FooterComponent) => ({
  component: FooterComponent,
  props: args,
});

// TODO: bring back groups once they're supported in controls
// const externalGroupId = 'External Link';
// const internalGroupId = 'Internal Link';

const baseProps = {
  footerLinks: [
    {
      link: '/data-security',
      title: 'Data Security',
      external: false,
    },
    {
      link: 'https://www.schaeffler.com',
      title: 'Schaefffler Homepage',
      external: true,
    },
  ],
  appVersion: '0.0.1',
};

export const primary = Template.bind({});
primary.args = baseProps;

const TemplateWithCustomContent: Story<FooterComponent> = (
  args: FooterComponent
) => ({
  component: FooterComponent,
  props: args,
  template: `
    <schaeffler-footer
      [footerLinks]="footerLinks"
      [appVersion]="appVersion">
        <span class="text-light leading-4 text-caption">Custom Content Here</span>
    </schaeffler-footer>
  `,
});

export const withCustomContent = TemplateWithCustomContent.bind({});
withCustomContent.args = baseProps;
