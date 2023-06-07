import { ControlValueAccessor } from '@angular/forms';

// Source: https://stackoverflow.com/a/65177817
export const NOOP_VALUE_ACCESSOR: ControlValueAccessor = {
  writeValue(): void {},
  registerOnChange(): void {},
  registerOnTouched(): void {},
};
