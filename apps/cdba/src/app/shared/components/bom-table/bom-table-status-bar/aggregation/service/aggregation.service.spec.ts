import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CellRange, GridApi } from 'ag-grid-community';

import { AggregationStatusBar } from '@cdba/shared/models';
import { AggregationStatusBarData } from '@cdba/shared/models/aggregation-status-bar.model';

import { AggregationService } from './aggregation.service';

describe('AggregationService', () => {
  let service: AggregationService;
  let spectator: SpectatorService<AggregationService>;

  let emptyModel: AggregationStatusBar;

  const createService = createServiceFactory({
    service: AggregationService,
  });

  const mockedGetRow = jest.fn().mockImplementation((i) => {
    switch (i) {
      case 0: {
        return { rowIndex: 0 };
      }
      case 1: {
        return { rowIndex: 1 };
      }
      case 2: {
        return { rowIndex: 2 };
      }
      case 3: {
        return { rowIndex: 3 };
      }
      case 4: {
        return { rowIndex: 4 };
      }
      case 5: {
        return { rowIndex: 5 };
      }
      case 6: {
        return { rowIndex: 6 };
      }
      case 7: {
        return { rowIndex: 7 };
      }
      case 8: {
        return { rowIndex: 8 };
      }
      default: {
        return { rowIndex: 0 };
      }
    }
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;

    emptyModel = new AggregationStatusBar(
      false,
      false,
      new AggregationStatusBarData(new Map(), new Map()),
      0,
      0,
      0,
      0,
      0
    );

    jest.clearAllMocks();
  });

  describe('Basic test', () => {
    test('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('calculateModel', () => {
    it('should not calculateModel when cellRanges is empty', () => {
      const inputModel = emptyModel;
      const cellRanges = [] as unknown as CellRange[];
      const api = {} as unknown as GridApi;

      const resetModelSpy = jest.spyOn(
        AggregationService.prototype as any,
        'resetModel'
      );

      resetModelSpy.mockImplementationOnce(() => {});

      service.calculateStatusBarValues(inputModel, cellRanges, api);

      expect(resetModelSpy).toBeCalledTimes(1);
    });
    it('should calculateModel when cellRanges is populated', () => {
      const inputModel = emptyModel;
      const cellRanges = [{}, {}] as unknown as CellRange[];
      const api = {} as unknown as GridApi;

      const extractSelectedCellsSpy = jest.spyOn(
        AggregationService.prototype as any,
        'extractSelectedCells'
      );
      const calculateModelSpy = jest.spyOn(
        AggregationService.prototype as any,
        'calculateModel'
      );

      extractSelectedCellsSpy.mockImplementationOnce(() => {});
      calculateModelSpy.mockImplementationOnce(() => {});

      service.calculateStatusBarValues(inputModel, cellRanges, api);

      expect(extractSelectedCellsSpy).toBeCalledTimes(1);
      expect(calculateModelSpy).toBeCalledTimes(1);
      expect(calculateModelSpy).toBeCalledWith(inputModel);
    });
    it('should hide model with less than 2 number cells', () => {
      const cells = new Map<string, number>();

      cells.set('column0_r0', 1.235_69);

      const inputModel = emptyModel;
      inputModel.data = new AggregationStatusBarData(cells, new Map());

      const outputModel = service['calculateModel'](inputModel);

      const expectedModel = emptyModel;
      expectedModel.isVisible = false;
      expectedModel.showFullModel = false;

      expect(outputModel).toStrictEqual(expectedModel);
    });
    it('should hide model with less than 2 string cells', () => {
      const cells = new Map<string, string>();

      cells.set('column0_r0', 'test0');

      const inputModel = emptyModel;
      inputModel.data = new AggregationStatusBarData(new Map(), cells);

      const outputModel = service['calculateModel'](inputModel);

      const expectedModel = emptyModel;
      expectedModel.isVisible = false;
      expectedModel.showFullModel = false;

      expect(outputModel).toStrictEqual(expectedModel);
    });
    it('should calculate model with more than 2 number cells', () => {
      const cells = new Map<string, number>();

      cells.set('column0_r0', 1.235_69);
      cells.set('column1_r0', 2.566_54);
      cells.set('column0_r1', 1.564_68);
      cells.set('column1_r1', 3.124_67);
      cells.set('column0_r2', 4.135_68);
      cells.set('column1_r2', 2.648_43);

      const inputModel = emptyModel;
      inputModel.data = new AggregationStatusBarData(cells, new Map());

      const outputModel = service['calculateModel'](inputModel);

      const expectedModel = new AggregationStatusBar(
        true,
        true,
        new AggregationStatusBarData(cells, new Map()),
        2.546,
        6,
        1.2357,
        4.1357,
        15.2757
      );

      expect(outputModel).toStrictEqual(expectedModel);
    });
    it('should calculate partial model with more than 2 string cells', () => {
      const cells = new Map<string, string>();

      cells.set('column0_r0', 'test0');
      cells.set('column1_r0', 'test1');
      cells.set('column0_r1', 'test2');
      cells.set('column1_r1', 'test3');
      cells.set('column0_r2', 'test4');
      cells.set('column1_r2', 'test5');

      const inputModel = emptyModel;
      inputModel.data = new AggregationStatusBarData(new Map(), cells);

      const outputModel = service['calculateModel'](inputModel);

      const expectedModel = new AggregationStatusBar(
        true,
        false,
        new AggregationStatusBarData(new Map(), cells),
        0,
        6,
        0,
        0,
        0
      );

      expect(outputModel).toStrictEqual(expectedModel);
    });
  });

  describe('extractSelectedCells', () => {
    it('should extract number cells in two ranges without value repetitions from cell ranges', () => {
      const rowModel = {
        getRow: mockedGetRow,
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 2 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column0'),
            },
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
          ],
        },
        {
          startRow: { rowIndex: 1 },
          endRow: { rowIndex: 6 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
            {
              getId: jest.fn().mockReturnValue('column2'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest.fn().mockReturnValue(1),
      } as unknown as GridApi;

      const expectedCells = new Map<string, number>();
      expectedCells.set('column0_r0', 1);
      expectedCells.set('column1_r0', 1);
      expectedCells.set('column0_r1', 1);
      expectedCells.set('column1_r1', 1);
      expectedCells.set('column0_r2', 1);
      expectedCells.set('column1_r2', 1);

      expectedCells.set('column2_r1', 1);
      expectedCells.set('column2_r2', 1);
      expectedCells.set('column1_r3', 1);
      expectedCells.set('column2_r3', 1);
      expectedCells.set('column1_r4', 1);
      expectedCells.set('column2_r4', 1);
      expectedCells.set('column1_r5', 1);
      expectedCells.set('column2_r5', 1);
      expectedCells.set('column1_r6', 1);
      expectedCells.set('column2_r6', 1);

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(expectedCells, new Map())
      );
    });
    it('should extract number cells in two seperate ranges from cell ranges', () => {
      const rowModel = {
        getRow: mockedGetRow,
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 2 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column0'),
            },
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
          ],
        },
        {
          startRow: { rowIndex: 4 },
          endRow: { rowIndex: 8 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column3'),
            },
            {
              getId: jest.fn().mockReturnValue('column4'),
            },
            {
              getId: jest.fn().mockReturnValue('column5'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest.fn().mockReturnValue(1),
      } as unknown as GridApi;

      const expectedCells = new Map<string, number>();
      expectedCells.set('column0_r0', 1);
      expectedCells.set('column1_r0', 1);
      expectedCells.set('column0_r1', 1);
      expectedCells.set('column1_r1', 1);
      expectedCells.set('column0_r2', 1);
      expectedCells.set('column1_r2', 1);

      expectedCells.set('column3_r4', 1);
      expectedCells.set('column4_r4', 1);
      expectedCells.set('column5_r4', 1);
      expectedCells.set('column3_r5', 1);
      expectedCells.set('column4_r5', 1);
      expectedCells.set('column5_r5', 1);
      expectedCells.set('column3_r6', 1);
      expectedCells.set('column4_r6', 1);
      expectedCells.set('column5_r6', 1);
      expectedCells.set('column3_r7', 1);
      expectedCells.set('column4_r7', 1);
      expectedCells.set('column5_r7', 1);
      expectedCells.set('column3_r8', 1);
      expectedCells.set('column4_r8', 1);
      expectedCells.set('column5_r8', 1);

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(expectedCells, new Map())
      );
    });
    it('should extract number cells in a range from cell ranges', () => {
      const rowModel = {
        getRow: jest
          .fn()
          .mockReturnValueOnce({ rowIndex: 0 })
          .mockReturnValueOnce({ rowIndex: 0 })
          .mockReturnValueOnce({ rowIndex: 1 })
          .mockReturnValueOnce({ rowIndex: 1 }),
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 2 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column0'),
            },
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest
          .fn()
          .mockReturnValueOnce(1)
          .mockReturnValueOnce(2)
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(4),
      } as unknown as GridApi;

      const expectedCells = new Map<string, number>();
      expectedCells.set('column0_r0', 1);
      expectedCells.set('column1_r0', 2);
      expectedCells.set('column0_r1', 3);
      expectedCells.set('column1_r1', 4);

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(expectedCells, new Map())
      );
    });
    it('should extract number cells in a row from cell ranges', () => {
      const rowModel = {
        getRow: jest.fn().mockReturnValue({ rowIndex: 1 }),
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 4 },
          columns: [
            {
              getId: jest
                .fn()
                .mockReturnValueOnce('column0')
                .mockReturnValueOnce('column1')
                .mockReturnValueOnce('column2')
                .mockReturnValueOnce('column3'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest
          .fn()
          .mockReturnValueOnce(1)
          .mockReturnValueOnce(2)
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(4),
      } as unknown as GridApi;

      const expectedCells = new Map<string, number>();
      expectedCells.set('column0_r1', 1);
      expectedCells.set('column1_r1', 2);
      expectedCells.set('column2_r1', 3);
      expectedCells.set('column3_r1', 4);

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(expectedCells, new Map())
      );
    });

    it('should extract selected number cells in a column from cell ranges', () => {
      const rowModel = {
        getRow: jest
          .fn()
          .mockReturnValueOnce({ rowIndex: 0 })
          .mockReturnValueOnce({ rowIndex: 1 })
          .mockReturnValueOnce({ rowIndex: 2 })
          .mockReturnValueOnce({ rowIndex: 3 }),
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 4 },
          columns: [{ getId: jest.fn().mockReturnValue('column') }],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest
          .fn()
          .mockReturnValueOnce(1)
          .mockReturnValueOnce(2)
          .mockReturnValueOnce(3)
          .mockReturnValueOnce(4),
      } as unknown as GridApi;

      const expectedCells = new Map<string, number>();
      expectedCells.set('column_r0', 1);
      expectedCells.set('column_r1', 2);
      expectedCells.set('column_r2', 3);
      expectedCells.set('column_r3', 4);

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(expectedCells, new Map())
      );
    });
    it('should extract string cells in two ranges without value repetitions from cell ranges', () => {
      const rowModel = {
        getRow: mockedGetRow,
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 2 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column0'),
            },
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
          ],
        },
        {
          startRow: { rowIndex: 1 },
          endRow: { rowIndex: 6 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
            {
              getId: jest.fn().mockReturnValue('column2'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest.fn().mockReturnValue('test'),
      } as unknown as GridApi;

      const expectedCells = new Map<string, string>();
      expectedCells.set('column0_r0', 'test');
      expectedCells.set('column1_r0', 'test');
      expectedCells.set('column0_r1', 'test');
      expectedCells.set('column1_r1', 'test');
      expectedCells.set('column0_r2', 'test');
      expectedCells.set('column1_r2', 'test');

      expectedCells.set('column2_r1', 'test');
      expectedCells.set('column2_r2', 'test');
      expectedCells.set('column1_r3', 'test');
      expectedCells.set('column2_r3', 'test');
      expectedCells.set('column1_r4', 'test');
      expectedCells.set('column2_r4', 'test');
      expectedCells.set('column1_r5', 'test');
      expectedCells.set('column2_r5', 'test');
      expectedCells.set('column1_r6', 'test');
      expectedCells.set('column2_r6', 'test');

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(new Map(), expectedCells)
      );
    });
    it('should extract string cells in two seperate ranges from cell ranges', () => {
      const rowModel = {
        getRow: mockedGetRow,
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 2 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column0'),
            },
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
          ],
        },
        {
          startRow: { rowIndex: 4 },
          endRow: { rowIndex: 8 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column3'),
            },
            {
              getId: jest.fn().mockReturnValue('column4'),
            },
            {
              getId: jest.fn().mockReturnValue('column5'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest.fn().mockReturnValue('test'),
      } as unknown as GridApi;

      const expectedCells = new Map<string, string>();
      expectedCells.set('column0_r0', 'test');
      expectedCells.set('column1_r0', 'test');
      expectedCells.set('column0_r1', 'test');
      expectedCells.set('column1_r1', 'test');
      expectedCells.set('column0_r2', 'test');
      expectedCells.set('column1_r2', 'test');

      expectedCells.set('column3_r4', 'test');
      expectedCells.set('column4_r4', 'test');
      expectedCells.set('column5_r4', 'test');
      expectedCells.set('column3_r5', 'test');
      expectedCells.set('column4_r5', 'test');
      expectedCells.set('column5_r5', 'test');
      expectedCells.set('column3_r6', 'test');
      expectedCells.set('column4_r6', 'test');
      expectedCells.set('column5_r6', 'test');
      expectedCells.set('column3_r7', 'test');
      expectedCells.set('column4_r7', 'test');
      expectedCells.set('column5_r7', 'test');
      expectedCells.set('column3_r8', 'test');
      expectedCells.set('column4_r8', 'test');
      expectedCells.set('column5_r8', 'test');

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(new Map(), expectedCells)
      );
    });
    it('should extract string cells in a range from cell ranges', () => {
      const rowModel = {
        getRow: jest
          .fn()
          .mockReturnValueOnce({ rowIndex: 0 })
          .mockReturnValueOnce({ rowIndex: 0 })
          .mockReturnValueOnce({ rowIndex: 1 })
          .mockReturnValueOnce({ rowIndex: 1 }),
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 2 },
          columns: [
            {
              getId: jest.fn().mockReturnValue('column0'),
            },
            {
              getId: jest.fn().mockReturnValue('column1'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest
          .fn()
          .mockReturnValueOnce('test0')
          .mockReturnValueOnce('test1')
          .mockReturnValueOnce('test2')
          .mockReturnValueOnce('test3'),
      } as unknown as GridApi;

      const expectedCells = new Map<string, string>();
      expectedCells.set('column0_r0', 'test0');
      expectedCells.set('column1_r0', 'test1');
      expectedCells.set('column0_r1', 'test2');
      expectedCells.set('column1_r1', 'test3');

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(new Map(), expectedCells)
      );
    });
    it('should extract string cells in a row from cell ranges', () => {
      const rowModel = {
        getRow: jest.fn().mockReturnValue({ rowIndex: 1 }),
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 4 },
          columns: [
            {
              getId: jest
                .fn()
                .mockReturnValueOnce('column0')
                .mockReturnValueOnce('column1')
                .mockReturnValueOnce('column2')
                .mockReturnValueOnce('column3'),
            },
          ],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest
          .fn()
          .mockReturnValueOnce('test0')
          .mockReturnValueOnce('test1')
          .mockReturnValueOnce('test2')
          .mockReturnValueOnce('test3'),
      } as unknown as GridApi;

      const expectedCells = new Map<string, string>();
      expectedCells.set('column0_r1', 'test0');
      expectedCells.set('column1_r1', 'test1');
      expectedCells.set('column2_r1', 'test2');
      expectedCells.set('column3_r1', 'test3');

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(new Map(), expectedCells)
      );
    });

    it('should extract selected string cells in a column from cell ranges', () => {
      const rowModel = {
        getRow: jest
          .fn()
          .mockReturnValueOnce({ rowIndex: 0 })
          .mockReturnValueOnce({ rowIndex: 1 })
          .mockReturnValueOnce({ rowIndex: 2 })
          .mockReturnValueOnce({ rowIndex: 3 }),
      };

      const cellRanges = [
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 4 },
          columns: [{ getId: jest.fn().mockReturnValue('column') }],
        },
      ] as unknown as CellRange[];
      const api = {
        getModel: jest.fn(() => rowModel),
        getValue: jest
          .fn()
          .mockReturnValueOnce('test0')
          .mockReturnValueOnce('test1')
          .mockReturnValueOnce('test2')
          .mockReturnValueOnce('test3'),
      } as unknown as GridApi;

      const expectedCells = new Map<string, string>();
      expectedCells.set('column_r0', 'test0');
      expectedCells.set('column_r1', 'test1');
      expectedCells.set('column_r2', 'test2');
      expectedCells.set('column_r3', 'test3');

      expect(service['extractSelectedCells'](cellRanges, api)).toStrictEqual(
        new AggregationStatusBarData(new Map(), expectedCells)
      );
    });
  });

  describe('restModel', () => {
    it('should reset the model', () => {
      const dummyMap = new Map<string, number>();
      dummyMap.set('0', 0);
      dummyMap.set('1', 1);
      dummyMap.set('2', 2);

      const inputAggregationModel = new AggregationStatusBar(
        true,
        true,
        new AggregationStatusBarData(dummyMap, new Map()),
        5,
        10,
        15,
        20,
        25
      );

      expect(service['resetModel'](inputAggregationModel)).toStrictEqual(
        emptyModel
      );
    });
  });

  describe('roundUp', () => {
    it('should round up the values', () => {
      const precision = 4;

      expect(service['roundUp'](0.12, precision)).toBe(0.12);
      expect(service['roundUp'](0.1234, precision)).toBe(0.1234);
      expect(service['roundUp'](0.123_45, precision)).toBe(0.1235);
      expect(service['roundUp'](0.123_49, precision)).toBe(0.1235);
    });
  });
});
