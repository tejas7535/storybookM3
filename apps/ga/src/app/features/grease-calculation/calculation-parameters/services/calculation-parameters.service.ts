import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { convertCelsiusToFahrenheit } from '@ga/shared/helpers/temperature-helpers';
import { convertGramToOunces } from '@ga/shared/helpers/weight-helpers';
import { MeasurementUnits } from '@ga/shared/models';
import { MeasurementUnitsService } from '@ga/shared/services';

@Injectable()
export class CalculationParametersService {
  protected environmentTemperature: UntypedFormControl;

  constructor(
    private readonly measurementUnitsService: MeasurementUnitsService
  ) {}

  public loadUnit = (): string =>
    this.measurementUnitsService.getMeasurementUnits() ===
    MeasurementUnits.Imperial
      ? 'lbf'
      : 'N';

  public temperatureUnit = (): string =>
    this.measurementUnitsService.getMeasurementUnits() ===
    MeasurementUnits.Imperial
      ? '°F'
      : '°C';

  public weightUnit = (): string =>
    this.measurementUnitsService.getMeasurementUnits() ===
    MeasurementUnits.Imperial
      ? 'oz'
      : 'g';

  public getEnvironmentTemperatureControl = () =>
    (this.environmentTemperature = new UntypedFormControl(
      this.getTemperatureFromCelsius(20),
      [
        Validators.required,
        Validators.max(this.getTemperatureFromCelsius(300)),
        Validators.min(this.getTemperatureFromCelsius(-100)),
      ]
    ));

  public getOperatingTemperatureControl = () =>
    new UntypedFormControl(this.getTemperatureFromCelsius(70), [
      Validators.required,
      Validators.max(this.getTemperatureFromCelsius(230)),
      Validators.min(this.getTemperatureFromCelsius(-40)),
      this.operatingTemperatureValidator(),
    ]);

  private operatingTemperatureValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (
        this.valueIsSet(control) &&
        this.valueIsSet(this.environmentTemperature) &&
        control.value < this.environmentTemperature?.value
      ) {
        return {
          lowerThanEnvironmentTemperature: true,
        };
      }

      return undefined;
    };
  }

  public getWeightFromGram = (gram: number): number =>
    this.measurementUnitsService.getMeasurementUnits() ===
    MeasurementUnits.Imperial
      ? convertGramToOunces(gram)
      : gram;

  private readonly getTemperatureFromCelsius = (centigrade: number): number =>
    this.measurementUnitsService.getMeasurementUnits() ===
    MeasurementUnits.Imperial
      ? convertCelsiusToFahrenheit(centigrade)
      : centigrade;

  private readonly valueIsSet = (control: AbstractControl): boolean =>
    control?.value !== null && control?.value !== undefined;
}
