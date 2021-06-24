import { Employee } from './employee.model';
import { PercentageFluctuationRate } from './percentage-fluctuation-rate.model';

export class FluctuationKpi {
  public constructor(
    public kpiRates: PercentageFluctuationRate,
    public orgUnitName: string,
    public exitEmployees: Employee[]
  ) {}
}
