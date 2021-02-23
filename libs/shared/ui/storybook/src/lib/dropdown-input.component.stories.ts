import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { object, text } from '@storybook/addon-knobs';

import {
  DropdownInputComponent,
  DropdownInputModule,
} from '@schaeffler/dropdown-input';

import READMEMd from '../../../dropdown-input/README.md';

export default {
  title: 'DropdownInput',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

const baseComponent = {
  moduleMetadata: {
    imports: [BrowserAnimationsModule, DropdownInputModule],
  },
  component: DropdownInputComponent,
  template: `<div style="width: 300px">
        <schaeffler-dropdown-input
            [options]="options"
            [placeholder]="placeholder"
            [hint]="hint"
        ></schaeffler-dropdown-input>
    </div>`,
  props: {
    options: object('options', [
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
    ]),
    placeholder: text('placeholder', 'Select an option'),
    hint: text('hint', 'optional hint'),
  },
};

export const primary = () => ({
  ...baseComponent,
});
