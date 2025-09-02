import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  output,
  untracked,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { filter } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { Unitset } from '@lsa/shared/models/preferences.model';
import { LsaTemperaturePipe } from '@lsa/shared/pipes/units/temperature.pipe';
import { fahrenheitToCelcius } from '@lsa/shared/pipes/units/unit-conversion.helper';

interface Boundaries {
  min: number;
  max: number;
}

@Component({
  selector: 'lsa-temperature-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoModule,
    MatSliderModule,
    LsaTemperaturePipe,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './temperature-input.component.html',
})
export class TemperatureInputComponent implements OnInit {
  /**
   * All outputs are handled in metric units
   **/
  public update = output<Boundaries>();

  protected marks = input<number[]>([]);

  /**
   * Input is assumed to be a metric unit
   **/
  protected minLimit = input<number>();

  /**
   * Input is assumed to be a metric unit
   **/
  protected maxLimit = input<number>();

  protected inputFormat = input(Unitset.SI);

  protected initialMin = input<number>();
  protected initialMax = input<number>();

  protected bounds = new FormGroup({
    min: new FormControl(this.initialMin()),
    max: new FormControl(this.initialMax()),
  });

  protected temperatureSign = computed(() =>
    this.inputFormat() === Unitset.SI ? '°C' : '°F'
  );

  protected markPositions = computed(() => {
    const markPositions = this.marks();

    if (markPositions.length === 0) {
      return [];
    }

    const sliderRange = this.maxLimit() + Math.abs(this.minLimit());
    const tempSign = this.inputFormat() === Unitset.SI ? '°C' : '°F';

    return markPositions.map((temperature) => {
      const localTemperature = this.tempPipe.transform(
        temperature,
        this.inputFormat()
      );
      const offset = Math.abs(this.minLimit() - temperature) / sliderRange;

      return {
        temperature: localTemperature,
        symbol: tempSign,
        offset: offset * 100,
      };
    });
  });

  constructor(private readonly tempPipe: LsaTemperaturePipe) {
    let firstRun = true;
    effect(() => {
      // Effect to restore the form state after navigating
      if (!firstRun) {
        return;
      }
      const initialMin = this.tempPipe.transform(
        this.initialMin(),
        this.inputFormat()
      );
      const initialMax = this.tempPipe.transform(
        this.initialMax(),
        this.inputFormat()
      );

      this.bounds.patchValue({
        min: initialMin,
        max: initialMax,
      });
      firstRun = false;
    });
    effect(() => {
      const unitset = this.inputFormat();
      untracked(() => {
        const minValue = this.tempPipe.transform(this.initialMin(), unitset);
        const maxValue = this.tempPipe.transform(this.initialMax(), unitset);
        this.bounds.patchValue(
          {
            min: minValue,
            max: maxValue,
          },
          { emitEvent: false }
        );
      });
    });
  }

  ngOnInit(): void {
    this.bounds.valueChanges
      .pipe(filter(() => this.bounds.valid))
      .subscribe((value) => {
        const max =
          this.inputFormat() === Unitset.SI
            ? value.max
            : fahrenheitToCelcius(value.max);
        const min =
          this.inputFormat() === Unitset.SI
            ? value.min
            : fahrenheitToCelcius(value.min);
        this.update.emit({
          max: Math.round(max),
          min: Math.round(min),
        });
      });
  }
}
