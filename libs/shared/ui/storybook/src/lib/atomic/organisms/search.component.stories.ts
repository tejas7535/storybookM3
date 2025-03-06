import { action } from '@storybook/addon-actions';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  ArgTypes,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import READMEMd from '../../../../../inputs/search/src/lib/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { SearchComponent, SearchModule } from '@schaeffler/inputs/search';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { StringOption } from '@schaeffler/inputs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'wrapper',
  template: `
    <style>
      mat-chip {
        color: transparent;
      }
    </style>

    <div class="w-1/2">
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
        [control]="control"
        [filterFn]="filterFn"
        [isRoundedSearchComponent]="isRoundedSearchComponent"
        (searchUpdated)="onSearchUpdated($event)"
        (optionSelected)="onOptionSelected($event)"
      >
        @if (includeCustomOptions; as option) {
          <ng-template #customOptions let-option="option">
            <div class="flex items-center flex-col min-[850px]:flex-row">
              <span> {{ option.title }} some additional template text </span>
              <mat-chip class="ml-1">
                <mat-icon
                  class="!h-4 !w-4 cursor-pointer !text-[16px] !mr-1 align-sub"
                  >animation</mat-icon
                >
                Catalog Calculation</mat-chip
              >
              <mat-chip class="ml-1">
                <mat-icon
                  class="!h-4 !w-4 cursor-pointer !text-[16px] !mr-1 align-sub"
                  >home</mat-icon
                >CO2 Emission</mat-chip
              >
            </div>
          </ng-template>
        }
        <div
          loadingContent
          class="flex w-full flex-row content-center gap-4 p-4"
        >
          <mat-spinner diameter="16"></mat-spinner>
          <span class="text-caption">custom loading content</span>
        </div>
        <div errorContent class="flex w-full flex-row content-center gap-4 p-4">
          <mat-icon class="text-error">cancel</mat-icon>
          <span class="text-caption">custom error content</span>
        </div>
        <ng-container matErrorContent>Input is required</ng-container>
      </schaeffler-search>
    </div>
    <div class="mt-10 flex flex-row gap-4">
      <div>Current Value:</div>
      <div>{{ control.value | json }}</div>
    </div>
  `,
  standalone: false,
})
class WrapperComponentForSearch extends SearchComponent {
  public includeCustomOptions: boolean = false;
}

export default {
  title: 'Atomic/Organisms/Search',
  component: WrapperComponentForSearch,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SearchModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatChipsModule,
      ],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: {
    docs: {
      description: {
        story: READMEMd,
      },
    },
    badges: [Badges.Final],
  },
} as Meta<WrapperComponentForSearch>;

const Template: StoryFn<WrapperComponentForSearch> = (
  args: WrapperComponentForSearch
) => ({
  component: WrapperComponentForSearch,
  props: {
    ...args,
    onSearchUpdated: action('onSearchUpdated'),
    onOptionSelected: action('onOptionSelected'),
  },
});

let args: Partial<WrapperComponentForSearch> = {
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
    { id: 3, title: 'option3 (disabled)', disabled: true },
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
  filterFn: (option?: StringOption, value?: string) => {
    if (!value) {
      return true;
    }

    return option?.title
      ?.toLowerCase()
      .trim()
      .includes(value.toLowerCase().trim());
  },
};

const argTypes: Partial<ArgTypes<WrapperComponentForSearch>> = {
  control: {
    options: ['Default', 'Required'],
    control: 'radio',
    mapping: {
      Default: new FormControl(),
      Required: new FormControl(undefined, [Validators.required]),
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

export const Primary = Template.bind({});
Primary.args = { ...args, includeCustomOptions: false };
Primary.argTypes = argTypes;

export const WithRoundedBorders = Template.bind({});
WithRoundedBorders.args = {
  ...args,
  isRoundedSearchComponent: true,
  label: '',
  appearance: 'outline',
  includeCustomOptions: true,
};

WithRoundedBorders.argTypes = {
  ...argTypes,
  isRoundedSearchComponent: {
    defaultValue: 'true',
  },
};
