import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { ResultInputModel } from '@lsa/shared/models/result-inputs.model';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LubricationInputComponent } from './lubrication-input/lubrication-input.component';

@Component({
  selector: 'lsa-lubrication-inputs',
  templateUrl: './lubrication-inputs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LubricationInputComponent,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SharedTranslocoModule,
    PushPipe,
  ],
})
export class LubricationInputsComponent {
  @Input()
  public inputs: ResultInputModel;

  @Output()
  private readonly navigateToStep: EventEmitter<number> = new EventEmitter();

  readonly panelOpenState = signal(false);

  public navigate(stepIndex: number): void {
    this.navigateToStep.emit(stepIndex);
  }
}
