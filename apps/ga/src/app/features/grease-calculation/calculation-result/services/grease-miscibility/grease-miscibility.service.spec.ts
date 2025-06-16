import { of } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { CalculationParametersFacade } from '@ga/core/store';
import { Grease } from '@ga/shared/services/greases/greases.service';

import {
  GreaseReportSubordinate,
  GreaseReportSubordinateData,
  GreaseReportSubordinateIdentifier,
  GreaseReportSubordinateTitle,
  GreaseResult,
} from '../../models';
import { GreaseMiscibilityService } from './grease-miscibility.service';

describe('GreaseMiscibilityService', () => {
  let spectator: SpectatorService<GreaseMiscibilityService>;
  let service: GreaseMiscibilityService;

  const mockMixableSchaefflerGreases: Grease[] = [
    {
      id: 'schaeffler1',
      name: 'Schaeffler Grease 1',
      company: 'Schaeffler',
      mixableGreases: [],
    },
    {
      id: 'schaeffler2',
      name: 'Schaeffler Grease 2',
      company: 'Schaeffler',
      mixableGreases: [],
    },
    {
      id: 'matchById',
      name: 'Another Grease',
      company: 'Schaeffler',
      mixableGreases: [],
    },
  ];

  const mockCalculationParametersFacade = {
    mixableSchaefflerGreases$: of(mockMixableSchaefflerGreases),
  };

  const spectatorFactory = createServiceFactory({
    service: GreaseMiscibilityService,
    providers: [
      {
        provide: CalculationParametersFacade,
        useValue: mockCalculationParametersFacade,
      },
    ],
  });

  const createGreaseSubordinate = (title: string): GreaseReportSubordinate => ({
    identifier: 'greaseResult' as GreaseReportSubordinateIdentifier,
    titleID: GreaseReportSubordinateTitle.STRING_OUTP_RESULTS,
    greaseResult: {
      mainTitle: title,
      isSufficient: true,
      dataSource: [],
    } as GreaseResult,
    data: {
      items: [],
      fields: [],
      unitFields: [],
    } as GreaseReportSubordinateData,
    title: 'Test',
    subordinates: [],
  });

  beforeEach(() => {
    spectator = spectatorFactory();
    service = spectator.service;
  });

  it('should mark greases as miscible when their names match', () => {
    const subordinates: GreaseReportSubordinate[] = [
      createGreaseSubordinate('Non-matching Grease'),
      createGreaseSubordinate('Schaeffler Grease 1'),
      {
        identifier: 'text' as GreaseReportSubordinateIdentifier,
        titleID: GreaseReportSubordinateTitle.STRING_NOTE_BLOCK,
        title: 'Other',
        data: {
          items: [],
          fields: [],
          unitFields: [],
        } as GreaseReportSubordinateData,
        subordinates: [],
      },
    ];

    const result = service.markMixableGreases(subordinates);

    expect(
      result.find(
        (item: GreaseReportSubordinate) =>
          item.identifier === 'greaseResult' &&
          item.greaseResult?.mainTitle === 'Schaeffler Grease 1'
      )?.greaseResult?.isMiscible
    ).toBe(true);

    expect(
      result.find(
        (item: GreaseReportSubordinate) =>
          item.identifier === 'greaseResult' &&
          item.greaseResult?.mainTitle === 'Non-matching Grease'
      )?.greaseResult?.isMiscible
    ).toBe(false);
  });

  it('should sort miscible greases first', () => {
    const subordinates: GreaseReportSubordinate[] = [
      createGreaseSubordinate('Non-matching Grease'),
      createGreaseSubordinate('Schaeffler Grease 1'),
      {
        identifier: 'text' as GreaseReportSubordinateIdentifier,
        titleID: GreaseReportSubordinateTitle.STRING_NOTE_BLOCK,
        title: 'Other',
        data: {
          items: [],
          fields: [],
          unitFields: [],
        } as GreaseReportSubordinateData,
        subordinates: [],
      },
    ];

    const result = service.markMixableGreases(subordinates);

    expect(result[0].identifier).toBe('text');

    expect(result[1].identifier).toBe('greaseResult');
    expect(result[1].greaseResult?.mainTitle).toBe('Schaeffler Grease 1');
    expect(result[1].greaseResult?.isMiscible).toBe(true);

    expect(result[2].identifier).toBe('greaseResult');
    expect(result[2].greaseResult?.mainTitle).toBe('Non-matching Grease');
    expect(result[2].greaseResult?.isMiscible).toBe(false);
  });

  it('should handle empty mixable greases array', () => {
    const originalMixableGreases$ =
      mockCalculationParametersFacade.mixableSchaefflerGreases$;
    mockCalculationParametersFacade.mixableSchaefflerGreases$ = of([]);

    const subordinates: GreaseReportSubordinate[] = [
      createGreaseSubordinate('Any Grease'),
      {
        identifier: 'text' as GreaseReportSubordinateIdentifier,
        titleID: GreaseReportSubordinateTitle.STRING_NOTE_BLOCK,
        title: 'Other',
        data: {
          items: [],
          fields: [],
          unitFields: [],
        } as GreaseReportSubordinateData,
        subordinates: [],
      },
    ];

    const result = service.markMixableGreases(subordinates);

    expect(result.length).toBe(subordinates.length);

    expect(
      result.find(
        (item: GreaseReportSubordinate) =>
          item.identifier === 'greaseResult' &&
          item.greaseResult?.mainTitle === 'Any Grease'
      )?.greaseResult?.isMiscible
    ).toBe(false);

    mockCalculationParametersFacade.mixableSchaefflerGreases$ =
      originalMixableGreases$;
  });

  it('should handle null mixable greases', () => {
    jest
      .spyOn(service as any, 'mixableSchaefflerGreases')
      .mockReturnValue(undefined);

    const subordinates: GreaseReportSubordinate[] = [
      createGreaseSubordinate('Any Grease'),
    ];

    const result = service.markMixableGreases(subordinates);

    expect(result).toBe(subordinates);

    jest.restoreAllMocks();
  });

  it('should handle case insensitivity and extra spaces in names', () => {
    const subordinate = createGreaseSubordinate('  SCHAEFFLER grease 1  ');

    const result = service.markMixableGreases([subordinate]);

    expect(result.length).toBe(1);

    expect(result[0].greaseResult?.isMiscible).toBe(true);
  });

  it('should sort greases with same miscibility status correctly', () => {
    const subordinates: GreaseReportSubordinate[] = [
      createGreaseSubordinate('Schaeffler Grease 1'),
      createGreaseSubordinate('Schaeffler Grease 2'),
    ];

    const result = service.markMixableGreases(subordinates);

    expect(result[0].greaseResult?.isMiscible).toBe(true);
    expect(result[1].greaseResult?.isMiscible).toBe(true);

    expect(result[0].greaseResult?.mainTitle).toBe('Schaeffler Grease 1');
    expect(result[1].greaseResult?.mainTitle).toBe('Schaeffler Grease 2');
  });

  it('should handle greases with the ID match instead of name match', () => {
    const subordinate = createGreaseSubordinate('matchById');

    const result = service.markMixableGreases([subordinate]);

    expect(result[0].greaseResult?.isMiscible).toBe(true);
  });

  it('should sort two non-miscible greases correctly', () => {
    const subordinates: GreaseReportSubordinate[] = [
      createGreaseSubordinate('Non-matching Grease 1'),
      createGreaseSubordinate('Non-matching Grease 2'),
    ];

    const result = service.markMixableGreases(subordinates);

    expect(result[0].greaseResult?.isMiscible).toBe(false);
    expect(result[1].greaseResult?.isMiscible).toBe(false);

    expect(result[0].greaseResult?.mainTitle).toBe('Non-matching Grease 1');
    expect(result[1].greaseResult?.mainTitle).toBe('Non-matching Grease 2');
  });

  it('should return 1 when comparing non-miscible to miscible grease (reverse order)', () => {
    const nonMiscibleGrease = createGreaseSubordinate('Non-Miscible');
    const miscibleGrease = createGreaseSubordinate('Miscible');

    nonMiscibleGrease.greaseResult.isMiscible = false;
    miscibleGrease.greaseResult.isMiscible = true;

    const result = (service as any).sortSubordinatesByMiscibility([
      nonMiscibleGrease,
      miscibleGrease,
    ]);

    expect(result[0].greaseResult?.mainTitle).toBe('Miscible');
    expect(result[1].greaseResult?.mainTitle).toBe('Non-Miscible');
  });

  it('should test the sort function directly by accessing it from the service', () => {
    const nonMiscibleGrease = createGreaseSubordinate('Non-Miscible');
    const miscibleGrease = createGreaseSubordinate('Miscible');

    nonMiscibleGrease.greaseResult.isMiscible = false;
    miscibleGrease.greaseResult.isMiscible = true;

    const sort = (service as any).sortSubordinatesByMiscibility.bind(service);

    const result = sort([nonMiscibleGrease, miscibleGrease]);

    expect(result[0]).toBe(miscibleGrease);
    expect(result[1]).toBe(nonMiscibleGrease);
  });

  it('should test the sort comparison function to ensure branch coverage', () => {
    const a = {
      identifier: 'greaseResult',
      greaseResult: {
        isMiscible: false,
      },
    } as any;

    const b = {
      identifier: 'greaseResult',
      greaseResult: {
        isMiscible: true,
      },
    } as any;

    let sortCallback: (
      a: GreaseReportSubordinate,
      b: GreaseReportSubordinate
    ) => number;

    const originalSort = Array.prototype.sort;
    Array.prototype.sort = function (compareFunction: any) {
      sortCallback = compareFunction;

      return this;
    };

    (service as any).sortSubordinatesByMiscibility([a, b]);

    Array.prototype.sort = originalSort;

    expect(sortCallback).not.toBeUndefined();

    const callback = sortCallback as (
      a: GreaseReportSubordinate,
      b: GreaseReportSubordinate
    ) => number;
    const result = callback(a, b);
    expect(result).toBe(1);
  });
});
