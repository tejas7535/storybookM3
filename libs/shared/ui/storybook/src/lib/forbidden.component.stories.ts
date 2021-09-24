import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslocoModule } from '@ngneat/transloco';

import { ForbiddenComponent, ForbiddenModule } from '@schaeffler/empty-states';
import { StorybookTranslocoModule } from '@schaeffler/transloco';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../empty-states/src/lib/forbidden/README.md';
import { getMultiLanguageStoryTemplate } from '../../.storybook/storybook-transloco.module';

export default {
  title: 'Components/Forbidden',
  component: ForbiddenComponent,
  parameters: {
    notes: { markdown: READMEMd },
  },
  decorators: [
    moduleMetadata({
      imports: [
        ForbiddenModule,
        HttpClientModule,
        RouterTestingModule,
        StorybookTranslocoModule,
        TranslocoModule,
      ],
    }),
  ],
} as Meta<ForbiddenComponent>;

export const Template: Story<ForbiddenComponent> = (
  args: ForbiddenComponent
) => ({
  component: ForbiddenComponent,
  props: args,
});

export const Primary = Template.bind({});
