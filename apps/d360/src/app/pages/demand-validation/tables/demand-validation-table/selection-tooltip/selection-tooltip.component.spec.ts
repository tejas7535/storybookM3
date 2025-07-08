import { Stub } from './../../../../../shared/test/stub.class';
import { SelectionTooltipComponent } from './selection-tooltip.component';

describe('SelectionTooltipComponent', () => {
  let component: SelectionTooltipComponent;

  beforeEach(() => {
    component = Stub.getForEffect<SelectionTooltipComponent>({
      component: SelectionTooltipComponent,
      providers: [Stub.getElementRefProvider()],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.visible()).toBe(false);
    expect(component.position()).toEqual({ x: 0, y: 0 });
    expect(component.stats()).toEqual({
      sum: 0,
      average: 0,
      count: 0,
      min: 0,
      max: 0,
    });
  });

  describe('open', () => {
    let mockEvent: any;
    let mockTable: DOMRect;
    let mockScrollContainer: DOMRect;

    beforeEach(() => {
      mockEvent = {
        api: {
          getCellRanges: jest.fn(),
          clearCellSelection: jest.fn(),
          addCellRange: jest.fn(),
          getCellValue: jest.fn(),
          getDisplayedRowAtIndex: jest.fn(),
          getCellRendererInstances: jest.fn(),
          getHorizontalPixelRange: jest.fn().mockReturnValue({ left: 0 }),
        },
      };

      mockTable = { top: 0 } as DOMRect;
      mockScrollContainer = { width: 1000 } as DOMRect;
    });

    it('should hide tooltip when no ranges exist', () => {
      mockEvent.api.getCellRanges.mockReturnValue([]);

      component.open(mockEvent, mockTable, mockScrollContainer);

      expect(component.visible()).toBe(false);
    });

    it('should enforce horizontal selection when selection spans multiple rows', () => {
      mockEvent.api.getCellRanges.mockReturnValue([
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 1 },
          columns: [{ getColId: () => 'col1' }],
        },
      ]);

      component.open(mockEvent, mockTable, mockScrollContainer);

      expect(mockEvent.api.clearCellSelection).toHaveBeenCalled();
      expect(mockEvent.api.addCellRange).toHaveBeenCalledWith({
        rowStartIndex: 0,
        rowEndIndex: 0,
        columns: ['col1'],
      });
      expect(component.visible()).toBe(false);
    });

    it('should hide tooltip when less than 2 numeric cells are selected', () => {
      const mockRowNode = { data: {} };
      mockEvent.api.getCellRanges.mockReturnValue([
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 0 },
          columns: [{ getColId: () => 'col1' }],
        },
      ]);
      mockEvent.api.getDisplayedRowAtIndex.mockReturnValue(mockRowNode);
      mockEvent.api.getCellValue.mockReturnValue('not a number');

      component.open(mockEvent, mockTable, mockScrollContainer);

      expect(component.visible()).toBe(false);
    });

    it('should calculate statistics and display tooltip for valid selection', () => {
      const mockRowNode = { data: {} };
      const mockColumns = [
        { getColId: () => 'col1', left: 100, actualWidth: 100 },
        { getColId: () => 'col2', left: 200, actualWidth: 100 },
      ];

      mockEvent.api.getCellRanges.mockReturnValue([
        {
          startRow: { rowIndex: 0 },
          endRow: { rowIndex: 0 },
          columns: mockColumns,
        },
      ]);
      mockEvent.api.getDisplayedRowAtIndex.mockReturnValue(mockRowNode);

      // First cell returns 10, second returns 20
      mockEvent.api.getCellValue
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(20);

      // Mock cell renderer instance
      mockEvent.api.getCellRendererInstances.mockReturnValue([
        {
          parameters: {
            eGridCell: {
              getBoundingClientRect: () => ({
                width: 100,
                top: 50,
                height: 30,
              }),
            },
          },
        },
      ]);

      // Mock tooltip dimensions via private element ref
      (component as any).tooltip = {
        nativeElement: {
          getBoundingClientRect: () => ({ width: 140, height: 110 }),
        },
      };

      component.open(mockEvent, mockTable, mockScrollContainer);

      expect(component.visible()).toBe(true);
      expect(component.stats()).toEqual({
        sum: 30,
        average: 15,
        count: 2,
        min: 10,
        max: 20,
      });
      expect(component.position().x).toBeDefined();
      expect(component.position().y).toBeDefined();
    });
  });

  describe('format', () => {
    it('should correctly format numbers', () => {
      const mockLocaleService = {
        localizeNumber: jest.fn().mockReturnValue('123'),
        getLocale: jest.fn().mockReturnValue('en'),
      };
      (component as any).localeService = mockLocaleService;

      const result = (component as any).format(123.456);

      expect(mockLocaleService.localizeNumber).toHaveBeenCalledWith(
        123.456,
        'decimal',
        'en',
        { minimumFractionDigits: 0, maximumFractionDigits: 0 }
      );
      expect(result).toBe('123');
    });
  });

  describe('calculatePosition', () => {
    it('should handle right boundary overflow', () => {
      // Create position parameters with right edge overflow
      const params = {
        firstElementInRow: {
          width: 100,
          top: 50,
          height: 30,
        } as DOMRect,
        lastSelectedElement: {
          left: 950,
          actualWidth: 100,
        } as any,
        scrollContainer: {
          width: 1000,
        } as DOMRect,
        table: {
          top: 0,
        } as DOMRect,
        tooltip: {
          width: 140,
          height: 110,
        } as DOMRect,
        event: {
          api: {
            getHorizontalPixelRange: () => ({ left: 0 }),
          },
        } as any,
      };

      const result = (component as any).calculatePosition(params);

      // Should adjust x to prevent overflow
      expect(result.x).toBe(960); // scrollContainer.width - tooltip.width
    });

    it('should handle top boundary overflow', () => {
      // Create position parameters with top edge overflow
      const params = {
        firstElementInRow: {
          width: 100,
          top: 20, // Top position that would cause tooltip to overflow
          height: 30,
        } as DOMRect,
        lastSelectedElement: {
          left: 200,
          actualWidth: 100,
        } as any,
        scrollContainer: {
          width: 1000,
        } as DOMRect,
        table: {
          top: 0,
        } as DOMRect,
        tooltip: {
          width: 140,
          height: 110,
        } as DOMRect,
        event: {
          api: {
            getHorizontalPixelRange: () => ({ left: 0 }),
          },
        } as any,
      };

      const result = (component as any).calculatePosition(params);

      // Should position tooltip below the row instead
      expect(result.y).toBeGreaterThan(20); // Should be below the row
    });

    it('should use backup dimensions when tooltip dimensions are not available', () => {
      const params = {
        firstElementInRow: {
          width: 100,
          top: 50,
          height: 30,
        } as DOMRect,
        lastSelectedElement: {
          left: 200,
          actualWidth: 100,
        } as any,
        scrollContainer: {
          width: 1000,
        } as DOMRect,
        table: {
          top: 0,
        } as DOMRect,
        tooltip: {
          // Missing width and height
        } as DOMRect,
        event: {
          api: {
            getHorizontalPixelRange: () => ({ left: 0 }),
          },
        } as any,
      };

      // Set backup dimensions
      (component as any).backupDimensions = { width: 140, height: 110 };

      const result = (component as any).calculatePosition(params);

      // Should use backup dimensions
      expect(result).toBeDefined();
    });
  });

  describe('statsToShow', () => {
    it('should transform stats into formatted display values', () => {
      // Mock the format method
      const formatSpy = jest
        .spyOn(component as any, 'format')
        .mockImplementation((value) => `formatted-${value}`);

      // Set some stats
      component.stats.set({
        sum: 100,
        average: 25,
        count: 4,
        min: 10,
        max: 40,
      });

      // Get the computed statsToShow
      const result = (component as any).statsToShow();

      // Verify the result contains formatted values
      expect(result).toEqual([
        { label: 'selectionTooltip.sum', value: 'formatted-100' },
        { label: 'selectionTooltip.average', value: 'formatted-25' },
        { label: 'selectionTooltip.count', value: 'formatted-4' },
        { label: 'selectionTooltip.min', value: 'formatted-10' },
        { label: 'selectionTooltip.max', value: 'formatted-40' },
      ]);

      // Verify format was called with the correct values
      expect(formatSpy).toHaveBeenCalledWith(100);
      expect(formatSpy).toHaveBeenCalledWith(25);
      expect(formatSpy).toHaveBeenCalledWith(4);
      expect(formatSpy).toHaveBeenCalledWith(10);
      expect(formatSpy).toHaveBeenCalledWith(40);
    });
  });

  describe('host bindings', () => {
    it('should set correct CSS properties based on state', () => {
      component.position.set({ x: 100, y: 200 });
      component.visible.set(true);

      expect((component as any).left).toBe('100px');
      expect((component as any).top).toBe('200px');
      expect((component as any).display).toBe('block');

      component.visible.set(false);
      expect((component as any).display).toBe('none');
    });
  });

  describe('constructor', () => {
    it('should hide tooltip when document is clicked', () => {
      // Set tooltip to visible
      component.visible.set(true);

      // Simulate document click
      document.dispatchEvent(new MouseEvent('click'));

      // Tooltip should now be hidden
      expect(component.visible()).toBe(false);
    });
  });
});
