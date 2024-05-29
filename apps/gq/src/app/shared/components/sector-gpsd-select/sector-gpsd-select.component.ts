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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { map, tap } from 'rxjs';

import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { SectorGpsdModule } from '@gq/core/store/sector-gpsd/sector-gpsd.module';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  imports: [
    MatSelectModule,
    SharedTranslocoModule,
    PushPipe,
    ReactiveFormsModule,
    SectorGpsdModule,
    LetDirective,
    MatProgressSpinnerModule,
  ],
  selector: 'gq-sector-gpsd-select',
  templateUrl: './sector-gpsd-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SectorGpsdSelectComponent),
      multi: true,
    },
  ],
})
export class SectorGpsdSelectComponent implements ControlValueAccessor {
  @Input() appearance: 'fill' | 'outline' = 'fill';
  @Output() sectorGpsdSelected: EventEmitter<SectorGpsd> =
    new EventEmitter<SectorGpsd>();

  readonly NOT_AVAILABLE: SectorGpsd = {
    name: 'Not available',
    id: 'NOT_AVAILABLE',
  };
  readonly DEFAULT: SectorGpsd = { name: 'Standard Pricing', id: '6000001' };
  sectorGpsdControl: FormControl = new FormControl({
    disabled: true,
  });

  sectorGpsdLoading$ = inject(SectorGpsdFacade).sectorGpsdLoading$;
  sectorGpsds$ = inject(SectorGpsdFacade).sectorGpsds$.pipe(
    map((gpsds: SectorGpsd[]) => {
      if (gpsds?.length === 0) {
        return [this.NOT_AVAILABLE];
      }

      return gpsds;
    }),

    tap((gpsds) => {
      // determine disabled state and select Values
      if (!gpsds) {
        this.setDisabledState(true);

        return;
      }

      if (gpsds?.length === 1) {
        this.writeValue(gpsds[0]);
        this.setDisabledState(gpsds[0].id === this.NOT_AVAILABLE.id);
        this.sectorGpsdSelected.emit(this.getValueToEmit());
      }

      if (gpsds?.length > 1) {
        // select StandardPricing when available otherwise select first entry
        const indexStandardPricing = gpsds.findIndex(
          (gpsd) => gpsd.id === this.DEFAULT.id
        );

        this.writeValue(indexStandardPricing > -1 ? this.DEFAULT : gpsds[0]);
        this.setDisabledState(false);
        this.sectorGpsdSelected.emit(this.getValueToEmit());
      }
    })
  );

  private selectedSectorGpsd: SectorGpsd;

  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: SectorGpsd) => void;
  private onTouched: () => void;

  selectionChange(event: MatSelectChange): void {
    this.selectedSectorGpsd = event.value;

    const valueToEmit = this.getValueToEmit();
    this.sectorGpsdSelected.emit(valueToEmit);

    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(valueToEmit);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  compareFn(optionOne: SectorGpsd, optionTwo: SectorGpsd): boolean {
    return optionOne.id === optionTwo.id;
  }

  /**
   * Implementation of ControlValueAccessor
   * Writes the value to the formControls input property
   *
   */
  writeValue(type: SectorGpsd): void {
    this.selectedSectorGpsd = type;
    this.sectorGpsdControl.setValue(this.selectedSectorGpsd, {
      emitEvent: false,
    });
  }

  /**
   * Implementation of ControlValueAccessor
   * Registers a callback for a changed value
   */
  registerOnChange(callback: (value: SectorGpsd) => void): void {
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
      this.sectorGpsdControl.disable();
    } else {
      this.sectorGpsdControl.enable();
    }
  }
  private getValueToEmit(): SectorGpsd {
    return this.selectedSectorGpsd.id === this.NOT_AVAILABLE.id
      ? undefined
      : this.selectedSectorGpsd;
  }
}
