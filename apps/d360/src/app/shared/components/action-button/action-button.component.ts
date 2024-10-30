import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ButtonColor = 'primary' | 'secondary' | 'error' | '';
export type ButtonType =
  | 'mat-button'
  | 'mat-raised-button'
  | 'mat-flat-button'
  | 'mat-stroked-button'
  | 'mat-icon-button'
  | 'mat-fab'
  | 'mat-mini-fab';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [MatTooltipModule, MatButtonModule, MatIcon],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent {
  @Input() tooltip = '';
  @Input() disabled = false;
  @Input() color: ButtonColor = '';
  @Input() variant: ButtonType = 'mat-raised-button';
  @Input() icon = '';
}
