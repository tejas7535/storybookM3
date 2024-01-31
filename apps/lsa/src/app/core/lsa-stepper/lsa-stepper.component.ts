import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'lsa-stepper',
  templateUrl: './lsa-stepper.component.html',
  styleUrls: ['./lsa-stepper.component.scss'],
  standalone: true,
  providers: [{ provide: CdkStepper, useExisting: LsaStepperComponent }],
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CdkStepperModule,
    MatDividerModule,
  ],
})
export class LsaStepperComponent extends CdkStepper {
  get isLastItem(): boolean {
    return this.selectedIndex === this.steps.length - 1;
  }

  get isFirstItem(): boolean {
    return this.selectedIndex === 0;
  }

  get nextItemLabel(): string {
    if (this.isLastItem) {
      return '';
    }

    return this.steps.get(this.selectedIndex + 1)?.label;
  }

  get previousItemLabel(): string {
    if (this.isFirstItem) {
      return '';
    }

    return this.steps.get(this.selectedIndex - 1)?.label;
  }

  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
