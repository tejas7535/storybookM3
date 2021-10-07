import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { withDesign } from 'storybook-addon-designs';

import READMEMd from './snackbar/README.md';

@Component({
  selector: 'snack-bar-component-example',
  template: `
    <h4 class="text-h4 mb-6">
      Select the options and trigger the snackbar with the button.
    </h4>
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Snack bar duration (seconds)</mat-label>
      <input type="number" [(ngModel)]="durationInSeconds" matInput />
      <mat-hint>A value of "zero" or lower means infinite duration</mat-hint>
    </mat-form-field>
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Horizontal position</mat-label>
      <mat-select [(value)]="horizontalPosition">
        <mat-option value="start">Start</mat-option>
        <mat-option value="center">Center</mat-option>
        <mat-option value="end">End</mat-option>
        <mat-option value="left">Left</mat-option>
        <mat-option value="right">Right</mat-option>
      </mat-select>
      <mat-hint>Configure the snackbars horizontal position in screen</mat-hint>
    </mat-form-field>
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Vertical position</mat-label>
      <mat-select [(value)]="verticalPosition">
        <mat-option value="top">Top</mat-option>
        <mat-option value="bottom">Bottom</mat-option>
      </mat-select>
      <mat-hint>Configure the snackbars vertical position in screen</mat-hint>
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
    <mat-form-field appearance="fill" class="mr-4 mb-8">
      <mat-label>Icon</mat-label>
      <mat-select [(value)]="icon">
        <mat-option [value]="null">None</mat-option>
        <mat-option value="home">Home</mat-option>
        <mat-option value="favorite">Heart</mat-option>
      </mat-select>
      <mat-hint>Select an icon in the snackbar</mat-hint>
    </mat-form-field>
    <button
      (click)="openSnackbar(message, action)"
      data-cy="showInformationToast"
      mat-raised-button
    >
      Show Snackbar
    </button>
    <ng-template #snackBarTemplate>
      <div class="mat-simple-snackbar flex items-center">
        <mat-icon *ngIf="icon" class="mr-2">{{ icon }}</mat-icon>
        <span *ngIf="message.value" class="flex-shrink">{{
          message.value
        }}</span>
        <span *ngIf="action.value" class="flex-grow"></span>
        <div *ngIf="action.value" class="flex-shrink-0">
          <button mat-button (click)="onActionClick()">
            {{ action.value }}
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
class SnackbarExampleComponent {
  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  icon: 'home' | 'favorite' = null;

  messageBarTemplate: string = `Say <strong>Hello</strong>`;

  @ViewChild('snackBarTemplate') snackBarTemplate: TemplateRef<any>;

  public constructor(private readonly snackBar: MatSnackBar) {}

  public openSnackbar(
    message: HTMLInputElement,
    action: HTMLInputElement
  ): void {
    if (this.icon) {
      this.snackBar.openFromTemplate(this.snackBarTemplate, {
        duration: this.durationInSeconds * 1000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else {
      this.snackBar
        .open(message.value, action.value, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        })
        .onAction()
        .subscribe(() => {
          console.log('Snackbar Action');
        });
    }
  }

  public onActionClick(): void {
    this.snackBar.dismiss();
  }
}

export default {
  title: 'Material/Molecules/Snackbar',
  component: SnackbarExampleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
      ],
    }),
    withDesign,
  ],
  parameters: {
    notes: { markdown: READMEMd },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/hhhgg57rQRgJ3YJwOHewZ9/DS-Test?node-id=784%3A1768',
    },
  },
} as Meta<SnackbarExampleComponent>;

const Template: Story<SnackbarExampleComponent> = (
  args: SnackbarExampleComponent
) => ({
  component: SnackbarExampleComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
