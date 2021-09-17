import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ScrollToTopComponent,
  ScrollToTopDirective,
  ScrollToTopModule,
} from '@schaeffler/scroll-to-top';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../scroll-to-top/README.md';

export default {
  title: 'Components/ScrollToTop',
  component: ScrollToTopComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, ScrollToTopModule],
      providers: [ScrollToTopDirective],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<ScrollToTopComponent>;

const Template: Story<ScrollToTopComponent> = (args: ScrollToTopComponent) => ({
  component: ScrollToTopComponent,
  props: args,
  template: `
    <div style="height: 100%; left: 0; position: fixed; right: 0; top: 0; width: 100%;">
      <div style="height: 100%;">
          <div schaefflerScrollToTop>
              <div>
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
                  <h4>scroll down &#8595;</h4>
                  <br />
              </div>
              <schaeffler-scroll-to-top></schaeffler-scroll-to-top>
          </div>
      </div>
    </div>
  `,
});

export const Primary = Template.bind({});
Primary.args = {};
