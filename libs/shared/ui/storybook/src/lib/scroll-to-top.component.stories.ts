import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  ScrollToTopComponent,
  ScrollToTopDirective,
  ScrollToTopModule,
} from '@schaeffler/scroll-to-top';

import READMEMd from '../../../scroll-to-top/README.md';

const moduleMetadata = {
  imports: [CommonModule, BrowserAnimationsModule, ScrollToTopModule],
  providers: [ScrollToTopDirective],
};

const baseComponent = {
  moduleMetadata,
  component: ScrollToTopComponent,
};

// eslint-disable-next-line
export default {
  title: 'ScrollToTop',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
  template: `<div style="height: 100%; left: 0; position: fixed; right: 0; top: 0; width: 100%;">
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
            </div>`,
});
