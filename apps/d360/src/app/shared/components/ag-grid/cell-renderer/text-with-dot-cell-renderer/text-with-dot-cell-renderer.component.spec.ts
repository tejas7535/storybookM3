import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { TextWithDotCellRendererComponent } from './text-with-dot-cell-renderer.component';

describe('TextWithDotCellRendererComponent', () => {
  let spectator: Spectator<TextWithDotCellRendererComponent>;
  const createComponent = createComponentFactory(
    TextWithDotCellRendererComponent
  );

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('setValue', () => {
    it('should set value and parameters correctly', () => {
      const mockParams: ICellRendererParams & {
        materialClassification: () => string;
      } = {
        node: {
          group: true,
          expanded: false,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          setExpanded: jest.fn(),
        },
        materialClassification: () => 'Mock Material Classification',
      } as any;

      spectator.component['setValue'](mockParams);

      expect(spectator.component['value']).toBe('Mock Material Classification');
      expect(spectator.component['parameters']).toEqual(mockParams);
    });

    it('should set value and parameters correctly, if no materialClassification was provided', () => {
      const mockParams: ICellRendererParams & {
        materialClassification: () => string;
      } = {
        node: {
          group: true,
          expanded: false,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          setExpanded: jest.fn(),
        },
      } as any;

      spectator.component['setValue'](mockParams);

      expect(spectator.component['value']).toBeNull();
      expect(spectator.component['parameters']).toEqual(mockParams);
    });
  });

  describe('onClick', () => {
    it('should toggle expanded and call setExpanded', () => {
      const mockNode = {
        group: true,
        expanded: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        setExpanded: jest.fn(),
      } as any;

      spectator.component['parameters'] = { node: mockNode } as any;

      spectator.component.onClick();

      expect(mockNode.setExpanded).toHaveBeenCalledWith(true);
      expect(spectator.component['expanded']()).toBeTruthy();
    });
  });

  describe('destroy', () => {
    it('should remove the event listener', () => {
      const mockNode = {
        group: true,
        expanded: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        setExpanded: jest.fn(),
      } as any;

      spectator.component['parameters'] = { node: mockNode } as any;

      spectator.component.destroy();

      expect(mockNode.removeEventListener).toHaveBeenCalledWith(
        'expandedChanged',
        expect.any(Function)
      );
    });
  });
});
