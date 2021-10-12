import { HttpClientModule } from '@angular/common/http';

import { TranslocoModule } from '@ngneat/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  UnsupportedViewportComponent,
  UnsupportedViewportModule,
} from '@schaeffler/empty-states';

import READMEmd from '../../../empty-states/src/lib/unsupported-viewport/README.md';
import { StorybookTranslocoModule } from '../../.storybook/storybook-transloco.module';

export default {
  title: 'Empty-States/Unsupported Viewport',
  component: UnsupportedViewportComponent,
  decorators: [
    moduleMetadata({
      imports: [
        UnsupportedViewportModule,
        HttpClientModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEmd },
  },
} as Meta<UnsupportedViewportComponent>;

const Template: Story<UnsupportedViewportComponent> = (
  args: UnsupportedViewportComponent
) => ({
  component: UnsupportedViewportComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
