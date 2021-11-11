import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  SearchAutocompleteComponent,
  SearchAutocompleteModule,
  SearchAutocompleteOption,
} from '@schaeffler/search-autocomplete';

import READMEMd from '../../../../search-autocomplete/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

const options: SearchAutocompleteOption[] = [
  { title: 'Bearing A1', id: 'A1' },
  { title: 'Bearing B2', id: 'B2' },
  { title: 'Bearing C3', id: 'C3' },
  { title: 'Bearing D4', id: 'D4' },
  { title: 'Bearing E5', id: 'E5' },
  { title: 'Bearing F6', id: 'F6' },
  { title: 'Bearing G7', id: 'G7' },
  { title: 'Bearing H8', id: 'H8' },
  { title: 'Bearing XX', id: 'XX' },
];

export default {
  title: `${NavigationMain.Components}/Search Autocomplete`,
  components: SearchAutocompleteComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        SearchAutocompleteModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveComponentModule,
        MatIconModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<SearchAutocompleteComponent>;

const Template: Story<SearchAutocompleteComponent> = (
  args: SearchAutocompleteComponent
) => ({
  component: SearchAutocompleteComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  minimumChars: 3,
  label: 'Type in bearing',
  options,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  loadingMessage: 'Fetching data...',
  minimumChars: 3,
  label: 'Type in bearing',
  options,
};

export const NoResults = Template.bind({});
NoResults.args = {
  label: 'Type in anything',
  options: [],
};

export const Error = Template.bind({});
Error.args = {
  label: 'Type in anything',
  options,
  error: true,
};
