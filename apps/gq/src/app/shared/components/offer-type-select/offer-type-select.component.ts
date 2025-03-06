import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { OfferTypeFacade } from '@gq/core/store/offer-type/offer-type.facade';
import { OfferTypeModule } from '@gq/core/store/offer-type/offer-type.module';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  imports: [
    MatSelectModule,
    SharedTranslocoModule,
    PushPipe,
    ReactiveFormsModule,
    OfferTypeModule,
    LetDirective,
  ],
  selector: 'gq-offer-type-select',
  templateUrl: './offer-type-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OfferTypeSelectComponent),
      multi: true,
    },
  ],
})
export class OfferTypeSelectComponent implements ControlValueAccessor {
  @Output() offerTypeSelected: EventEmitter<OfferType> =
    new EventEmitter<OfferType>();
  @Input() appearance: 'fill' | 'outline' = 'fill';

  // default option
  readonly NO_ENTRY = { name: 'No Entry', id: -1 };

  offerTypes$ = inject(OfferTypeFacade).offerTypes$;
  offerTypeControl: FormControl = new FormControl({
    value: this.NO_ENTRY,
    disabled: false,
  });

  private selectedOfferType: OfferType;

  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: OfferType) => void;
  private onTouched: () => void;

  selectionChange(event: MatSelectChange): void {
    this.selectedOfferType = event.value;
    const valueToEmit =
      this.selectedOfferType.id === this.NO_ENTRY.id
        ? undefined
        : this.selectedOfferType;

    this.offerTypeSelected.emit(valueToEmit);

    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(valueToEmit);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  compareFn(optionOne: OfferType, optionTwo: OfferType): boolean {
    return optionOne.id === optionTwo.id;
  }

  /**
   * Implementation of ControlValueAccessor
   * Writes the value to the formControls input property
   *
   */
  writeValue(type: OfferType): void {
    // when formControl is initialized with undefined value, the default Value is to be set
    this.selectedOfferType = type ?? this.NO_ENTRY;
    this.offerTypeControl.setValue(this.selectedOfferType, {
      emitEvent: false,
    });
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for a changed value
   */
  registerOnChange(callback: (value: OfferType) => void): void {
    this.onChange = callback;
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for the touched state of the formControl
   */
  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  /**
   * Implementation of ControlValueAccessor
   *
   * @param isDisabled value to set the disabled state of the formControl
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.offerTypeControl.disable();
    } else {
      this.offerTypeControl.enable();
    }
  }
}
