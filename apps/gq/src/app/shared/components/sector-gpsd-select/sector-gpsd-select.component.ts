import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  isEditMode = input(false);
  appearance = input<'fill' | 'outline'>('fill');
  sectorGpsdSelected = output<SectorGpsd>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly sectorGpsdFacade = inject(SectorGpsdFacade);

  private readonly isDisabledByParent = signal(false);

  readonly NOT_AVAILABLE: SectorGpsd = {
    name: 'Not available',
    id: 'NOT_AVAILABLE',
  };
  readonly DEFAULT: SectorGpsd = { name: 'Standard Pricing', id: '6000001' };
  sectorGpsdControl: FormControl = new FormControl({
    disabled: true,
  });

  sectorGpsd = this.sectorGpsdFacade.selectedSectorGpsd$;
  sectorGpsdLoading$ = this.sectorGpsdFacade.sectorGpsdLoading$.pipe(
    tap((loading) => {
      // Reset selectedSectorGpsd when loading - for example when customer has changed
      // This change will prevent unwanted options in the dropdown (GQUOTE-4925)
      if (loading && !this.isEditMode()) {
        this.selectedSectorGpsd = null;
      }
    })
  );

  sectorGpsds$ = this.sectorGpsdFacade.sectorGpsds$.pipe(
    takeUntilDestroyed(this.destroyRef),
    map((gpsds: SectorGpsd[]) => {
      if (gpsds?.length === 0) {
        return [this.NOT_AVAILABLE];
      }

      // add Not Available option to the list to cover "old" cases (GQUOTE-5092)
      if (
        gpsds &&
        this.isEditMode() &&
        (!this.selectedSectorGpsd ||
          this.selectedSectorGpsd === this.NOT_AVAILABLE)
      ) {
        return [this.NOT_AVAILABLE, ...gpsds];
      }

      // if quotation contains partner role that is not listed in the db
      // add it to all available gpsds (GQUOTE-4711)
      if (this.selectedSectorGpsd?.id && gpsds) {
        const selectedEntry = gpsds.find(
          (entry) => entry.id === this.selectedSectorGpsd.id
        );

        if (!selectedEntry) {
          // make sure to filter out Not Available option (GQUOTE-4828)
          const newGpsds = [...gpsds, this.selectedSectorGpsd].filter(
            (entry) => entry.id !== this.NOT_AVAILABLE.id
          );

          // make sure that the added gpsd entry is put in the correct order by id (GQUOTE-819)
          newGpsds.sort((a, b) => +a.id - +b.id);

          return newGpsds;
        }
      }

      return gpsds;
    }),
    tap((gpsds) => {
      // if formControl has been initialValue skip setting the default value,
      // when onChange and onTouched are defined it is a formControl
      if (this.selectedSectorGpsd && this.onChange && this.onTouched) {
        return;
      }
      // determine disabled state and select Values
      if (!gpsds) {
        this.handleControlDisabledState(true);

        return;
      }

      let value;
      let disabledState = false;

      if (gpsds?.length === 1) {
        value = gpsds[0];
        disabledState = gpsds[0].id === this.NOT_AVAILABLE.id;
      }

      if (gpsds?.length > 1) {
        // select StandardPricing when available otherwise select first entry
        const indexStandardPricing = gpsds.findIndex(
          (gpsd) => gpsd.id === this.DEFAULT.id
        );

        value = indexStandardPricing > -1 ? this.DEFAULT : gpsds[0];
        disabledState = false;
      }

      // Set value to Not Available as a default in edit mode for "old" cases
      // which have no gpsd assigned (has null value in DB) (GQUOTE-5092)
      if (this.isEditMode()) {
        value = this.NOT_AVAILABLE;
      }

      this.writeValue(value);
      this.sectorGpsdSelected.emit(this.getValueToEmit());
      if (!this.isDisabledByParent()) {
        this.handleControlDisabledState(disabledState);
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
    return optionOne?.id === optionTwo?.id;
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
    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(this.getValueToEmit());
    }
    if (this.onTouched) {
      this.onTouched();
    }
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
    this.isDisabledByParent.set(isDisabled);
    this.handleControlDisabledState(isDisabled);
  }

  private handleControlDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.sectorGpsdControl.disable();
    } else {
      this.sectorGpsdControl.enable();
    }
  }

  private getValueToEmit(): SectorGpsd {
    return this.selectedSectorGpsd?.id === this.NOT_AVAILABLE.id
      ? undefined
      : this.selectedSectorGpsd;
  }
}
