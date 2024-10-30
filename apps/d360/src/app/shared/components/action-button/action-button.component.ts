import { Component, input, InputSignal } from '@angular/core';
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

/**
 * The ActionButton Component.
 *
 * @export
 * @class ActionButtonComponent
 */
@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [MatTooltipModule, MatButtonModule, MatIcon],
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent {
  /**
   * Use this property to add a Tooltip.
   *
   * @protected
   * @type {InputSignal<string>}
   * @memberof ActionButtonComponent
   */
  protected tooltip: InputSignal<string> = input('');

  /**
   * Use this property to disable the Button.
   *
   * @protected
   * @type {InputSignal<boolean>}
   * @memberof ActionButtonComponent
   */
  protected disabled: InputSignal<boolean> = input(false);

  /**
   * Use this property to add a different styling.
   *
   * @protected
   * @type {InputSignal<string>}
   * @memberof ActionButtonComponent
   */
  protected className: InputSignal<string> = input('');

  /**
   * Use this property to select the button type.
   *
   * @protected
   * @type {(InputSignal<ButtonType | string>)}
   * @memberof ActionButtonComponent
   */
  protected variant: InputSignal<ButtonType | string> =
    input('mat-raised-button');

  /**
   * Use this property to add an icon.
   *
   * @protected
   * @type {InputSignal<string>}
   * @memberof ActionButtonComponent
   */
  protected icon: InputSignal<string> = input('');
}
