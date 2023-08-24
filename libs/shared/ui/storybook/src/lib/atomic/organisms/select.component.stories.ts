import { provideAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';

import READMEMd from '../../../../../inputs/select/src/lib/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import { SelectComponent, SelectModule } from '@schaeffler/inputs/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { action } from '@storybook/addon-actions';
import { StringOption } from '@schaeffler/inputs';
import { StorybookTranslocoModule } from 'libs/shared/ui/storybook/.storybook/storybook-transloco.module';
import { Component, importProvidersFrom } from '@angular/core';

@Component({
  selector: 'wrapper',
  template: `<div style="width: 300px">
      <schaeffler-select
        [stringOptions]="stringOptions"
        [appearance]="appearance"
        [placeholder]="placeholder"
        [searchPlaceholder]="searchPlaceholder"
        [addEntryPlaceholder]="addEntryPlaceholder"
        [hint]="hint"
        [formFieldHint]="formFieldHint"
        [initialValue]="initialValue"
        [initialSearchValue]="initialSearchValue"
        [label]="label"
        [loading]="loading"
        [error]="error"
        [multiple]="multiple"
        [noResultsText]="noResultsText"
        [addEntry]="addEntry"
        [control]="control"
        [filterFn]="filterFn"
        [resetButton]="resetButton"
        [searchValueLengthTrigger]="searchValueLengthTrigger"
        [showTriggerTooltip]="showTriggerTooltip"
        [triggerTooltipDelay]="triggerTooltipDelay"
        [tooltipPosition]="tooltipPosition"
        [showNumberOfSelected]="showNumberOfSelected"
        (searchUpdated)="onSearchUpdated($event)"
        (entryAdded)="onEntryAdded($event)"
        (optionRemoved)="onOptionRemoved($event)"
        (optionSelected)="onOptionSelected($event)"
        (openedChange)="onOpenedChange($event)"
      >
        <div
          loadingContent
          class="flex flex-row w-full p-4 content-center gap-4"
        >
          <mat-spinner diameter="16"></mat-spinner>
          <span class="text-caption">custom loading content</span>
        </div>
        <div errorContent class="flex flex-row w-full p-4 content-center gap-4">
          <mat-icon class="text-error">cancel</mat-icon>
          <span class="text-caption">custom error content</span>
        </div>
        <ng-container matErrorContent>Input is required</ng-container>
      </schaeffler-select>
    </div>
    <div class="flex flex-row gap-4 mt-10">
      <div>Current Value:</div>
      <div>{{ control.value | json }}</div>
    </div> `,
})
class WrapperComponentForSelect extends SelectComponent {}

export default {
  title: 'Atomic/Organisms/Select',
  component: WrapperComponentForSelect,
  decorators: [
    moduleMetadata({
      imports: [SelectModule, MatProgressSpinnerModule, MatIconModule],
    }),
    applicationConfig({
      providers: [
        importProvidersFrom(StorybookTranslocoModule),
        provideAnimations(),
      ],
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
} as Meta<WrapperComponentForSelect>;

const Template: StoryFn<WrapperComponentForSelect> = (
  args: WrapperComponentForSelect
) => ({
  component: WrapperComponentForSelect,
  props: {
    ...args,
    onSearchUpdated: action('onSearchUpdated'),
    onEntryAdded: action('onEntryAdded'),
    onOptionRemoved: action('onOptionRemoved'),
    onOptionSelected: action('onOptionSelected'),
    onOpenedChange: action('onOpenedChange'),
  },
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
  formFieldHint: 'optional outer hint',
  initialSearchValue: '',
  searchValueLengthTrigger: 1,
  showNumberOfSelected: false,
  loading: false,
  error: false,
  multiple: false,
  noResultsText: 'No Results',
  addEntry: false,
  resetButton: true,
  showTriggerTooltip: false,
  triggerTooltipDelay: 1500,
};

Primary.argTypes = {
  control: {
    options: ['Default', 'Required'],
    control: 'radio',
    mapping: {
      Default: new FormControl(),
      Required: new FormControl('', [Validators.required]),
    },
    defaultValue: 'Default',
  },
  appearance: {
    options: ['fill', 'outline'],
    control: 'radio',
    defaultValue: 'fill',
  },
  initialValue: {
    options: ['none', 'option1'],
    control: 'radio',
    defaultValue: 'none',
    mapping: {
      none: undefined,
      option1: { id: 1, title: 'option1' },
    },
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
  tooltipPosition: {
    options: ['left', 'right', 'above', 'below', 'before', 'after'],
    control: 'select',
    defaultValue: 'below',
  },
};
