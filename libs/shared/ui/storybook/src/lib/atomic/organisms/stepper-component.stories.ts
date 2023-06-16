import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { StepperModule } from '@schaeffler/stepper';

import READMEMd from '../../../../../stepper/README.md';

import { Badges } from '../../../../.storybook/storybook-badges.constants';

@Component({
  selector: 'wrapper',
  styleUrls: ['../../../../../stepper/index.scss'],
  template: ` <mat-horizontal-stepper schaefflerSeparatedSteps linear>
    <mat-step [stepControl]="firstFormGroup">
      <form [formGroup]="firstFormGroup">
        <ng-template matStepLabel>Fill out your name</ng-template>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input
            matInput
            placeholder="Last name, First name"
            formControlName="firstCtrl"
            required
          />
        </mat-form-field>
        <div>
          <button mat-button matStepperNext>Next</button>
        </div>
      </form>
    </mat-step>
    <mat-step [stepControl]="secondFormGroup" label="Fill out your address">
      <form [formGroup]="secondFormGroup">
        <mat-form-field>
          <mat-label>Address</mat-label>
          <input
            matInput
            formControlName="secondCtrl"
            placeholder="Ex. 1 Main St, New York, NY"
            required
          />
        </mat-form-field>
        <div>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button matStepperNext>Next</button>
        </div>
      </form>
    </mat-step>
    <mat-step>
      <ng-template matStepLabel>Done</ng-template>
      <p>You are now done.</p>
      <div>
        <button mat-button matStepperPrevious>Back</button>
        <button mat-button (click)="stepper.reset()">Reset</button>
      </div>
    </mat-step>
  </mat-horizontal-stepper>`,
})
class WrapperComponentForStepper implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
}

export default {
  title: 'Atomic/Organisms/Stepper',
  component: WrapperComponentForStepper,
  decorators: [
    moduleMetadata({
      imports: [
        StepperModule,
        CommonModule,
        BrowserAnimationsModule,
        MatStepperModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
    badges: [Badges.Final],
  },
} as Meta<WrapperComponentForStepper>;

const Template: StoryFn<WrapperComponentForStepper> = (
  args: WrapperComponentForStepper
) => ({
  component: WrapperComponentForStepper,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
