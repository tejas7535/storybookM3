import {
  Component,
  effect,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomerEntry } from '../../../feature/global-selection/model';
import { OptionsLoadingResult } from '../../services/selectable-options.service';
import { SingleAutocompleteSelectedEvent } from '../inputs/autocomplete/model';
import { SingleAutocompletePreLoadedComponent } from '../inputs/autocomplete/single-autocomplete-pre-loaded/single-autocomplete-pre-loaded.component';
import { DisplayFunctions } from '../inputs/display-functions.utils';

/**
 * A component that provides a dropdown for selecting a customer from a list of options.
 *
 * @export
 * @class CustomerDropDownComponent
 */
@Component({
  selector: 'd360-customer-dropdown',
  imports: [
    SharedTranslocoModule,
    SingleAutocompletePreLoadedComponent,
    MatDividerModule,
  ],
  templateUrl: './customer-dropdown.component.html',
  styleUrls: ['./customer-dropdown.component.scss'],
})
export class CustomerDropDownComponent {
  /**
   * The form control associated with the selected customer entry.
   *
   * @type {InputSignal<FormControl<CustomerEntry>>}
   * @memberof CustomerDropDownComponent
   */
  public control: InputSignal<FormControl<CustomerEntry>> = input.required();

  /**
   * The parent form group that contains this form control.
   *
   * @type {InputSignal<FormGroup>}
   * @memberof CustomerDropDownComponent
   */
  public form: InputSignal<FormGroup> = input.required();

  /**
   * Draw a divider after sales org?
   *
   * @type {InputSignal<boolean>}
   * @memberof CustomerDropDownComponent
   */
  public divider: InputSignal<boolean> = input(false);

  /**
   * The className added to the dropdown e.g. to give them a width.
   *
   * @type {InputSignal<string>}
   * @memberof CustomerDropDownComponent
   */
  public className: InputSignal<string> = input('w-72');

  /**
   * Is the dropdown disabled?
   *
   * @type {InputSignal<boolean>}
   * @memberof CustomerDropDownComponent
   */
  public disabled: InputSignal<boolean> = input(false);

  /**
   * The result of loading options for the customer dropdown.
   *
   * @type {InputSignal<OptionsLoadingResult>}
   * @memberof CustomerDropDownComponent
   */
  public optionsLoadingResult: InputSignal<OptionsLoadingResult> = input({
    options: [],
  });

  /**
   * The currently selected customer entry.
   *
   * @type {InputSignal<CustomerEntry | null>}
   * @memberof CustomerDropDownComponent
   */
  public customer: InputSignal<CustomerEntry | null> = input(null);

  /**
   * An event emitter that emits when the selection changes in the dropdown.
   *
   * @type {OutputEmitterRef<SingleAutocompleteSelectedEvent>}
   * @memberof CustomerDropDownComponent
   */
  public selectionChange: OutputEmitterRef<SingleAutocompleteSelectedEvent> =
    output<SingleAutocompleteSelectedEvent>();

  /**
   * A function that determines how to display each customer in the dropdown list.
   * In this case, we use the `displayFnUnited` method from the `DisplayFunctions`
   * object to format the customer's name and address for display.
   */
  protected readonly displayFnUnited = DisplayFunctions.displayFnUnited;

  /**
   * Creates an instance of CustomerDropDownComponent.
   *
   * @memberof CustomerDropDownComponent
   */
  public constructor() {
    effect(() =>
      this.disabled() ? this.control().disable() : this.control().enable()
    );
  }

  /**
   * An event handler that is called when a customer is selected from the dropdown list.
   * It emits a `selectionChange` event with the selected customer as its payload.
   *
   * @protected
   * @param {SingleAutocompleteSelectedEvent} $event - The `SingleAutocompleteSelectedEvent` object that contains information about the selected customer.
   * @memberof CustomerDropDownComponent
   */
  protected onChange($event: SingleAutocompleteSelectedEvent): void {
    this.selectionChange.emit($event);
  }
}
