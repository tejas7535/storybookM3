import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { ColumnDefService } from './column-def.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ColumnDefService', () => {
  let service: ColumnDefService;
  let spectator: SpectatorService<ColumnDefService>;

  const createService = createServiceFactory({
    service: ColumnDefService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dateComparator', () => {
    let cellDate: string;
    beforeEach(() => {
      cellDate = '2020-12-02T08:09:03.9619909';
    });
    test('should return 0', () => {
      const compareDate = new Date('2020-12-02T00:00:00');

      const res = service.filterParams.comparator(compareDate, cellDate);
      expect(res).toBe(0);
    });
    test('should return 1', () => {
      const compareDate = new Date('2020-12-01T00:00:00');

      const res = service.filterParams.comparator(compareDate, cellDate);
      expect(res).toBe(1);
    });
    test('should return -1', () => {
      const compareDate = new Date('2020-12-03T00:00:00');

      const res = service.filterParams.comparator(compareDate, cellDate);
      expect(res).toBe(-1);
    });
  });
});
