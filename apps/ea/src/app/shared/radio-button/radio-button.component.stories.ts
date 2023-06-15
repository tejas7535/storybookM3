import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { RadioButtonComponent } from './radio-button.component';

@Component({
  selector: 'ea-radio-button-wrapper',
  // eslint-disable-next-line @angular-eslint/component-max-inline-declarations
  template: `
    <engineering-app>
      <div
        [formGroup]="formGroup"
        style="display: inline-block; margin-right: 1rem;"
        *ngFor="let option of options"
      >
        <ea-radio-button
          formControlName="radio"
          [label]="option.label"
          [value]="option.value"
          [isSubOption]="isSubOption"
        ></ea-radio-button>
      </div>
      <pre style="margin-top: 2rem">{{ formGroup.value | json }}</pre>
    </engineering-app>
  `,
})
class RadioButtonWrapperComponent {
  @Input() options: { label: string; value: string }[] = [];
  @Input() isSubOption = false;

  formGroup = new FormGroup({
    radio: new FormControl('1'),
  });
}

// eslint-disable-next-line import/no-default-export
export default {
  title: 'RadioButtonComponent',
  component: RadioButtonWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserModule, ReactiveFormsModule, RadioButtonComponent],
    }),
  ],
} as Meta<RadioButtonWrapperComponent>;

const Template: Story<RadioButtonWrapperComponent> = (
  args: RadioButtonWrapperComponent
) => ({
  props: args,
});

export const NormalOptions = Template.bind({});
NormalOptions.args = {
  options: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ],
};

export const SubOptions = Template.bind({});
SubOptions.args = {
  options: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 2', value: '3' },
  ],
  isSubOption: true,
};
