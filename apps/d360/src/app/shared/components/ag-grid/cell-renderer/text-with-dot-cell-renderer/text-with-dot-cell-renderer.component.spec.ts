import { ICellRendererParams } from 'ag-grid-enterprise';

import { Stub } from '../../../../test/stub.class';
import {
  TextWithDotCellRendererComponent,
  TextWithDotParams,
} from './text-with-dot-cell-renderer.component';

describe('TextWithDotCellRendererComponent', () => {
  let component: TextWithDotCellRendererComponent;

  beforeEach(() => {
    component = Stub.get<TextWithDotCellRendererComponent>({
      component: TextWithDotCellRendererComponent,
    });
  });

  describe('setValue', () => {
    it('should set parameters correctly', () => {
      const mockParams: ICellRendererParams = {
        node: {
          group: true,
          expanded: false,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          setExpanded: jest.fn(),
        },
      } as any;

      component['setValue'](mockParams);

      expect(component['parameters']).toEqual(mockParams);
    });

    it('should set isGroup to true when node.group is true', () => {
      const mockParams: ICellRendererParams = {
        node: {
          group: true,
          expanded: false,
          addEventListener: jest.fn(),
        },
      } as any;

      component['setValue'](mockParams);

      expect(component['isGroup']).toBe(true);
    });

    it('should set isGroup to false when node.group is falsy', () => {
      const mockParams: ICellRendererParams = {
        node: {
          group: false,
          expanded: false,
          addEventListener: jest.fn(),
        },
      } as any;

      component['setValue'](mockParams);

      expect(component['isGroup']).toBe(false);
    });

    it('should set syncIconTooltip from parameters', () => {
      const mockParams: TextWithDotParams<any> = {
        node: {
          group: true,
          expanded: false,
          addEventListener: jest.fn(),
        },
        syncIconTooltip: 'Test tooltip',
      } as any;

      component['setValue'](mockParams);

      expect(component['syncIconTooltip']).toBe('Test tooltip');
    });

    it('should set syncIconTooltip to empty string when not provided', () => {
      const mockParams: TextWithDotParams<any> = {
        node: {
          group: true,
          expanded: false,
          addEventListener: jest.fn(),
        },
        // syncIconTooltip not provided
      } as any;

      component['setValue'](mockParams);

      expect(component['syncIconTooltip']).toBe('');
    });

    it('should set expanded signal based on node.expanded', () => {
      const mockParams: ICellRendererParams = {
        node: {
          group: true,
          expanded: true,
          addEventListener: jest.fn(),
        },
      } as any;

      component['setValue'](mockParams);

      expect(component['expanded']()).toBe(true);
    });

    it('should add expandedChanged event listener to node', () => {
      const addEventListenerSpy = jest.fn();
      const mockParams: ICellRendererParams = {
        node: {
          group: true,
          expanded: false,
          addEventListener: addEventListenerSpy,
        },
      } as any;

      component['setValue'](mockParams);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'expandedChanged',
        component['onExpand']
      );
    });

    it('should handle the onExpand callback correctly', () => {
      // First setup component with initial state
      const mockNode = {
        group: true,
        expanded: false,
        addEventListener: jest.fn(),
      };

      const mockParams: ICellRendererParams = {
        node: mockNode,
      } as any;

      component['setValue'](mockParams);
      expect(component['expanded']()).toBe(false);

      // Now simulate the node expansion change
      mockNode.expanded = true;

      // Call the onExpand handler directly (it's stored during setValue)
      component['onExpand']();

      // Check that the expanded signal was updated
      expect(component['expanded']()).toBe(true);
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

      component['parameters'] = { node: mockNode } as any;

      component.onClick();

      expect(mockNode.setExpanded).toHaveBeenCalledWith(true);
      expect(component['expanded']()).toBeTruthy();
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

      component['parameters'] = { node: mockNode } as any;

      component.destroy();

      expect(mockNode.removeEventListener).toHaveBeenCalledWith(
        'expandedChanged',
        expect.any(Function)
      );
    });
  });
});
