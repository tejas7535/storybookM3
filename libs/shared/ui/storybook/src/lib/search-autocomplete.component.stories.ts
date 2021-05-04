import { CommonModule } from '@angular/common';

import { boolean, number, object, text } from '@storybook/addon-knobs';

import {
  SearchAutocompleteComponent,
  SearchAutocompleteModule,
  SearchAutocompleteOption,
} from '@schaeffler/search-autocomplete';

import READMEMd from '../../../search-autocomplete/README.md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveComponentModule } from '@ngrx/component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

const moduleMetadata = {
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
};

const baseComponent = {
  moduleMetadata,
  component: SearchAutocompleteComponent,
};

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

// tslint:disable-next-line: no-default-export
export default {
  title: 'Search Autocomplete',
  parameters: {
    notes: { markdown: READMEMd },
  },
};
export const primary = () => ({
  ...baseComponent,
  props: {
    minimumChars: number('How many characters to start showing options', 3),
    label: text('Placeholder text', 'Type in bearings'),
    options: object('Options', options),
  },
});

export const loading = () => ({
  ...baseComponent,
  props: {
    loading: boolean('Loading options?', true),
    loadingMessage: text('Loading Message', 'Fetching data...'),
    minimumChars: number('How many characters to start showing options', 3),
    label: text('Placeholder text', 'Type in bearings'),
    options: object('Options', options),
  },
});

export const noResults = () => ({
  ...baseComponent,
  props: {
    label: text('Placeholder text', 'Type in anything'),
    options: object('Options', []),
  },
});

export const error = () => ({
  ...baseComponent,
  props: {
    label: text('Placeholder text', 'Type in anything'),
    options: object('Options', options),
    error: boolean('Error?', true),
  },
});
