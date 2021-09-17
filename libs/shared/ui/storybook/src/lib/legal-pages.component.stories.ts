import { APP_BASE_HREF } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';

import { of } from 'rxjs';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  LegalComponent,
  LegalModule,
  LegalRoute,
  PERSON_RESPONSIBLE,
} from '@schaeffler/legal-pages';
import { StorybookTranslocoModule } from '@schaeffler/transloco';

const routerMock = {
  events: of(
    new NavigationEnd(0, `${LegalRoute}/imprint`, `${LegalRoute}/imprint`)
  ),
  url: `${LegalRoute}/imprint`,
};

export default {
  title: 'Components/Legal Pages',
  decorators: [
    moduleMetadata({
      imports: [StorybookTranslocoModule, LegalModule, RouterModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: LegalRoute },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: `${LegalRoute}/imprint`,
            },
          },
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: PERSON_RESPONSIBLE,
          useValue: 'Channing Matthew Tatum',
        },
      ],
    }),
  ],
} as Meta<LegalComponent>;

const Template: Story<LegalComponent> = (args: LegalComponent) => ({
  component: LegalComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
