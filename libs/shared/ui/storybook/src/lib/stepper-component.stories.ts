import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { boolean } from '@storybook/addon-knobs';

import { Step, StepperModule } from '@schaeffler/stepper';

import READMEMd from '../../../stepper/README.md';

const moduleMetadata = {
  imports: [
    StepperModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
};

@Component({
  selector: 'wrapper',
  template: `
    <schaeffler-stepper
      [formGroup]="formGroup"
      [steps]="steps"
      [showButtons]="showButtons"
      [linear]="linear"
    ></schaeffler-stepper>
    <ng-template #step1
      ><input [formControl]="formGroup.get('step1').get('input1')" type="text"
    /></ng-template>
    <ng-template #step2
      ><input [formControl]="formGroup.get('step2').get('input2')" type="text"
    /></ng-template>
    <ng-template #step3
      ><input [formControl]="formGroup.get('step3').get('input3')" type="text"
    /></ng-template>
    <ng-template #step4
      ><input [formControl]="formGroup.get('step4').get('input4')" type="text"
    /></ng-template>
  `,
})
class WrapperComponentForStepper {
  @ViewChild('step1', { static: true }) step1: TemplateRef<any>;
  @ViewChild('step2', { static: true }) step2: TemplateRef<any>;
  @ViewChild('step3', { static: true }) step3: TemplateRef<any>;
  @ViewChild('step4', { static: true }) step4: TemplateRef<any>;

  @Input() linear = false;

  @Input() showButtons = false;

  formGroup = new FormGroup({
    step1: new FormGroup({
      input1: new FormControl('step 1 placeholder', Validators.required),
    }),
    step2: new FormGroup({
      input2: new FormControl('step 2 placeholder', Validators.required),
    }),
    step3: new FormGroup({
      input3: new FormControl('step 3 placeholder', Validators.required),
    }),
    step4: new FormGroup({
      input4: new FormControl('step 4 placeholder', Validators.required),
    }),
  });

  get steps(): Step[] {
    return [
      {
        label: 'step 1',
        editable: false,
        content: this.step1,
        formGroupName: 'step1',
      },
      {
        label: 'step 2',
        editable: true,
        content: this.step2,
        formGroupName: 'step2',
      },
      {
        label: 'step 3',
        editable: true,
        content: this.step3,
        formGroupName: 'step3',
      },
      {
        label: 'step 4',
        editable: true,
        content: this.step4,
        formGroupName: 'step4',
      },
    ];
  }
}

const baseComponent = {
  moduleMetadata,
  component: WrapperComponentForStepper,
};

export default {
  title: 'Stepper',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

export const primary = () => ({
  ...baseComponent,
});

export const showButtons = () => ({
  ...baseComponent,
  props: {
    showButtons: boolean('Show buttons', true),
  },
});

export const linear = () => ({
  ...baseComponent,
  props: {
    linear: boolean('linear', true),
    showButtons: true,
  },
});
