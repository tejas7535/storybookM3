import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  DropdownInputComponent,
  DropdownInputModule,
} from '@schaeffler/dropdown-input';

import READMEMd from '../../../../dropdown-input/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Components}/DropdownInput`,
  component: DropdownInputComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, DropdownInputModule],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<DropdownInputComponent>;

const Template: Story<DropdownInputComponent> = (
  args: DropdownInputComponent
) => ({
  component: DropdownInputComponent,
  props: args,
  template: `
    <div style="width: 300px">
      <schaeffler-dropdown-input
          [formControl]="formControl"
          [options]="options"
          [placeholder]="placeholder"
          [hint]="hint"
          [label]="label"
      ></schaeffler-dropdown-input>
    </div>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  options: [
    { id: 0, value: 'option0' },
    { id: 1, value: 'option1' },
    { id: 2, value: 'option2' },
    { id: 3, value: 'option3' },
    { id: 4, value: 'option4' },
    { id: 5, value: 'option5' },
    { id: 6, value: 'option6' },
    { id: 7, value: 'option7' },
    { id: 8, value: 'option8' },
    { id: 9, value: 'option9' },
  ],
  placeholder: 'Select an option',
  hint: 'optional hint',
  label: 'Option Selection',
};
