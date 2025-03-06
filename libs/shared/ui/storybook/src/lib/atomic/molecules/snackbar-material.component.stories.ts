import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryFn,
} from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import { Badges } from '../../../../.storybook/storybook-badges.constants';
import READMEMd from './snackbar/README.md';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'snack-bar-component-example',
  template: `
    <h4 class="mb-6 text-h4">
      Select the options and trigger the snackbar with the button.
    </h4>
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Snack bar duration (seconds)</mat-label>
      <input type="number" [(ngModel)]="durationInSeconds" matInput />
      <mat-hint>A value of "zero" or lower means infinite duration</mat-hint>
    </mat-form-field>
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Message</mat-label>
      <input matInput value="Disco party!" #message />
      <mat-hint>A long message creates a multi-line snackbar</mat-hint>
    </mat-form-field>
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Action</mat-label>
      <input matInput value="Dance" #action />
      <mat-hint>Create the button text in the snackbar</mat-hint>
    </mat-form-field>
    <button
      (click)="openSnackbar(message, action)"
      data-cy="showInformationToast"
      mat-raised-button
    >
      Show Snackbar
    </button>
  `,
  standalone: false,
})
class SnackbarExampleComponent {
  durationInSeconds = 5;

  public constructor(private readonly snackBar: MatSnackBar) {}

  public openSnackbar(
    message: HTMLInputElement,
    action: HTMLInputElement
  ): void {
    this.snackBar
      .open(message.value, action.value, {
        duration: this.durationInSeconds * 1000,
      })
      .onAction()
      .subscribe(() => {
        console.log('Snackbar Action');
      });
  }
}

export default {
  title: 'Atomic/Molecules/Snackbar',
  component: SnackbarExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
      ],
    }),
    withDesign,
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
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=784%3A1768',
    },
  },
} as Meta<SnackbarExampleComponent>;

const Template: StoryFn<SnackbarExampleComponent> = (
  args: SnackbarExampleComponent
) => ({
  component: SnackbarExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
