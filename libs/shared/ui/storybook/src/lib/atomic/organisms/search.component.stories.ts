import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import READMEMd from '../../../../../inputs/search/src/lib/README.md';
import {
  NavigationAtomic,
  NavigationMain,
} from '../../../../.storybook/storybook-navigation.constants';
import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { SearchComponent, SearchModule } from '@schaeffler/inputs/search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormControl } from '@angular/forms';

export default {
  title: `${NavigationMain.Atomic}/${NavigationAtomic.Organisms}/Search`,
  component: SearchComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        SearchModule,
        MatProgressSpinnerModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<SearchComponent>;

const Template: Story<SearchComponent> = (args: SearchComponent) => ({
  component: SearchComponent,
  props: {
    ...args,
    onSearchUpdated: action('onSearchUpdated'),
    onOptionSelected: action('onOptionSelected'),
  },
  template: `
    <div style="width: 300px">
      <schaeffler-search
          [stringOptions]="stringOptions"
          [appearance]="appearance"
          [placeholder]="placeholder"
          [hint]="hint"
          [label]="label"
          [loading]="loading"
          [error]="error"
          [noResultsText]="noResultsText"
          [displayWith]="displayWith"
          [formControl]="formControl"
          (searchUpdated)="onSearchUpdated($event)"
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
      </schaeffler-search>
    </div>
    <div class="flex flex-row gap-4 mt-10">
      <div>Current Value:</div>
      <div>{{ formControl.value | json }}</div>
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
  hint: 'optional hint',
  loading: false,
  error: false,
  noResultsText: 'No Results',
};

Primary.argTypes = {
  formControl: {
    options: ['Default'],
    control: 'radio',
    mapping: {
      Default: new FormControl(),
    },
    defaultValue: 'Default',
  },
  displayWith: {
    options: ['id', 'title'],
    control: 'radio',
    defaultValue: 'title',
  },
  appearance: {
    options: ['fill', 'outline'],
    control: 'radio',
    defaultValue: 'fill',
  },
};
