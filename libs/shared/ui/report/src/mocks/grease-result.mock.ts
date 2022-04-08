import { GreaseResult } from '../lib/models/grease-result.model';

export const greaseResultMock: GreaseResult = {
  title: 'Arcanol MULTI2',
  subtitlePart1: 'Mineral oil',
  subtitlePart2: 'NLGI2',
  subtitlePart3: 'Lithium soap',
  showValues: false,
  displayedColumns: ['title', 'values'],
  dataSource: [
    {
      title: 'initalGreaseQuantity',
      values:
        '<span>59.40 g</span></br><span class="text-low-emphasis">66 cm³</span>',
    },
    {
      title: 'manualRelubricationQuantityInterval',
      values:
        '<span>38.70 g/501 days</span><br><span class="text-low-emphasis">43.00 cm³/501 days</span>',
      tooltip: 'manualRelubricationQuantityIntervalTooltip',
    },
    {
      title: 'automaticRelubricationQuantityPerDay',
      values:
        '<span>0.0792 g/day</span><br><span class="text-low-emphasis">0.088 cm³/day</span>',
      tooltip: 'automaticRelubricationQuantityPerDayTooltip',
    },
    {
      title: 'greaseServiceLife',
      values: '~ 941 day',
      display: false,
    },
    {
      title: 'automaticRelubricationPerWeek',
      values:
        '<span>0.5544 g/7 days</span><br><span class="text-low-emphasis">0.616 cm³/7 days</span>',
      display: false,
    },
    {
      title: 'automaticRelubricationPerMonth',
      values:
        '<span>2.38 g/30 days</span><br><span class="text-low-emphasis">2.64 cm³/30 days</span>',
      display: false,
    },
    {
      title: 'automaticRelubricationPerYear',
      values:
        '<span>28.91 g/365 days</span><br><span class="text-low-emphasis">32.12 cm³/365 days</span>',
      display: false,
    },
    {
      display: false,
      title: 'viscosityRatio',
      values: '2.33',
    },
    {
      title: 'baseOilViscosityAt40',
      values: '110.0 mm²/s',
      display: false,
    },
    {
      title: 'lowerTemperatureLimit',
      values: '-20.0 °C',
      display: false,
      tooltip: 'lowerTemperatureLimitTooltip',
    },
    {
      title: 'upperTemperatureLimit',
      values: '120.0 °C',
      display: false,
      tooltip: 'upperTemperatureLimitTooltip',
    },
    {
      title: 'additiveRequired',
      values: 'no',
      display: false,
      tooltip: 'additiveRequiredTooltip',
    },
    {
      title: 'effectiveEpAdditivation',
      values: 'no',
      display: false,
    },
    {
      title: 'density',
      values: '0.900 kg/dm³',
      display: false,
    },
    {
      title: 'lowFriction',
      values: '0 (suitable)',
      display: false,
    },
    {
      title: 'suitableForVibrations',
      values: '0 (suitable)',
      display: false,
    },
    {
      title: 'supportForSeals',
      values: '0 (suitable)',
      display: false,
    },
    {
      title: 'H1Registration',
      values: 'no',
      display: false,
    },
  ],
};
