import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../../../inputs/select/src/lib/README.md';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { SelectComponent, SelectModule } from '@schaeffler/inputs/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { action } from '@storybook/addon-actions';
import { StringOption } from '@schaeffler/inputs';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Select`,
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        SelectModule,
        MatProgressSpinnerModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<SelectComponent>;

const Template: Story<SelectComponent> = (args: SelectComponent) => ({
  component: SelectComponent,
  props: {
    ...args,
    onSearchUpdated: action('onSearchUpdated'),
    onEntryAdded: action('onEntryAdded'),
    onOptionRemoved: action('onOptionRemoved'),
    onOptionSelected: action('onOptionSelected'),
  },
  template: `
    <div style="width: 300px">
      <schaeffler-select
          [stringOptions]="stringOptions"
          [appearance]="appearance"
          [placeholder]="placeholder"
          [searchPlaceholder]="searchPlaceholder"
          [addEntryPlaceholder]="addEntryPlaceholder"
          [hint]="hint"
          [label]="label"
          [loading]="loading"
          [error]="error"
          [multiple]="multiple"
          [noResultsText]="noResultsText"
          [addEntry]="addEntry"
          [control]="control"
          [filterFn]="filterFn"
          (searchUpdated)="onSearchUpdated($event)"
          (entryAdded)="onEntryAdded($event)"
          (optionRemoved)="onOptionRemoved($event)"
          (optionSelected)="onOptionSelected($event)"
      >
        <div loadingContent class="flex flex-row w-full p-4 content-center gap-4">
          <mat-spinner diameter="16"></mat-spinner>
          <span class="text-caption">custom loading content</span>
        </div>
        <div errorContent class="flex flex-row w-full p-4 content-center gap-4">
          <mat-icon class="text-error">cancel</mat-icon>
          <span class="text-caption">custom error content</span>
        </div>
      </schaeffler-select>
    </div>
    <div class="flex flex-row gap-4 mt-10">
      <div>Current Value:</div>
      <div>{{ control.value | json }}</div>
    </div>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  stringOptions: [
    {
      id: 0,
      title: 'option0',
      tooltip: 'tooltip',
      tooltipDelay: 1000,
      removable: true,
    },
    { id: 1, title: 'option1' },
    { id: 2, title: 'option2' },
    { id: 3, title: 'option3' },
    { id: 4, title: 'option4' },
    { id: 5, title: 'option5' },
    { id: 6, title: 'option6' },
    { id: 7, title: 'option7' },
    { id: 8, title: 'option8' },
    { id: 9, title: 'option9' },
  ],
  label: 'Option Selection',
  placeholder: 'Select an option',
  searchPlaceholder: 'Search...',
  addEntryPlaceholder: 'New Entry',
  hint: 'optional hint',
  loading: false,
  error: false,
  multiple: false,
  noResultsText: 'No Results',
  addEntry: false,
};

Primary.argTypes = {
  control: {
    options: ['Default'],
    control: 'radio',
    mapping: {
      Default: new FormControl(),
    },
    defaultValue: 'Default',
  },
  appearance: {
    options: ['fill', 'outline'],
    control: 'radio',
    defaultValue: 'fill',
  },
  filterFn: {
    options: ['No Filter', 'Custom Filter'],
    control: 'radio',
    mapping: {
      'No Filter': undefined,
      'Custom Filter': (option: StringOption, value: string): boolean => {
        if (!value) {
          return true;
        }

        return option.title
          ?.toLowerCase()
          .trimEnd()
          .includes(value.toLowerCase().trim());
      },
    },
    defaultValue: 'No Filter',
  },
};
