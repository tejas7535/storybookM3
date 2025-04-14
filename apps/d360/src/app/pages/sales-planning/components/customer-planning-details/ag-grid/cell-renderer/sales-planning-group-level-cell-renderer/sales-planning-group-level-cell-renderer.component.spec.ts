import { Stub } from './../../../../../../../shared/test/stub.class';
import { SalesPlanningGroupLevelCellRendererComponent } from './sales-planning-group-level-cell-renderer.component';

describe('SalesPlanningGroupLevelCellRendererComponent', () => {
  let component: SalesPlanningGroupLevelCellRendererComponent;

  beforeEach(() => {
    component = Stub.get({
      component: SalesPlanningGroupLevelCellRendererComponent,
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('get isGroup', () => {
    it('should return true when the node is a group', () => {
      component['parameters'] = { node: { group: true } } as any;
      expect(component.isGroup).toBe(true);
    });

    it('should return false when the node is not a group', () => {
      component['parameters'] = { node: { group: false } } as any;
      expect(component.isGroup).toBe(false);
    });

    it('should return false when parameters or node are undefined', () => {
      component['parameters'] = undefined;
      expect(component.isGroup).toBe(false);
    });
  });

  describe('get isChildElement', () => {
    it('should return true when the node level is 1', () => {
      component['parameters'] = { node: { level: 1 } } as any;
      expect(component.isChildElement).toBe(true);
    });

    it('should return false when the node level is not 1', () => {
      component['parameters'] = { node: { level: 2 } } as any;
      expect(component.isChildElement).toBe(false);
    });

    it('should return false when parameters or node are undefined', () => {
      component['parameters'] = undefined;
      expect(component.isChildElement).toBe(false);
    });
  });

  describe('get rowData', () => {
    it('should return the node data when parameters and node are defined', () => {
      const mockData = { planningYear: 2023, planningMaterial: 'Material1' };
      component['parameters'] = { node: { data: mockData } } as any;

      expect(component.rowData).toBe(mockData);
    });

    it('should return undefined when parameters are undefined', () => {
      component['parameters'] = undefined;

      expect(component.rowData).toBeUndefined();
    });

    it('should return undefined when node is undefined', () => {
      component['parameters'] = { node: undefined } as any;

      expect(component.rowData).toBeUndefined();
    });
  });

  describe('setValue', () => {
    it('should set value to "planningMaterial - planningMaterialText" when node level is 1 and data contains required keys', () => {
      const mockParameters = {
        node: {
          level: 1,
          data: {
            planningMaterial: 'Material1',
            planningMaterialText: 'Text1',
          },
          expanded: false,
          addEventListener: jest.fn(),
        },
        clickAction: jest.fn(),
      } as any;

      component['setValue'](mockParameters);

      expect(component['value']).toBe('Material1 - Text1');
      expect(component['parameters']).toBe(mockParameters);
      expect(component['onClickAction']).toBe(mockParameters.clickAction);
      expect(component['expanded']()).toBe(false);
      expect(mockParameters.node.addEventListener).toHaveBeenCalledWith(
        'expandedChanged',
        expect.any(Function)
      );
    });

    it('should set value to "planningYear" when node level is not 1 or data does not contain required keys', () => {
      const mockParameters = {
        node: {
          level: 2,
          data: {
            planningYear: 2023,
          },
          expanded: true,
          addEventListener: jest.fn(),
        },
        clickAction: jest.fn(),
      } as any;

      component['setValue'](mockParameters);

      expect(component['value']).toBe(2023);
      expect(component['parameters']).toBe(mockParameters);
      expect(component['onClickAction']).toBe(mockParameters.clickAction);
      expect(component['expanded']()).toBe(true);
      expect(mockParameters.node.addEventListener).toHaveBeenCalledWith(
        'expandedChanged',
        expect.any(Function)
      );
    });

    it('should set expanded state based on node expanded property', () => {
      const mockParameters = {
        node: {
          level: 1,
          data: {
            planningMaterial: 'Material1',
            planningMaterialText: 'Text1',
          },
          expanded: true,
          addEventListener: jest.fn(),
        },
        clickAction: jest.fn(),
      } as any;

      component['setValue'](mockParameters);

      expect(component['expanded']()).toBe(true);
    });

    it('should register "expandedChanged" event listener on the node', () => {
      const mockParameters = {
        node: {
          level: 1,
          data: {
            planningMaterial: 'Material1',
            planningMaterialText: 'Text1',
          },
          expanded: false,
          addEventListener: jest.fn(),
        },
        clickAction: jest.fn(),
      } as any;

      component['setValue'](mockParameters);

      expect(mockParameters.node.addEventListener).toHaveBeenCalledWith(
        'expandedChanged',
        expect.any(Function)
      );
    });
  });

  describe('onClickExpand', () => {
    it('should toggle the expanded state to true when initially false', () => {
      const mockNode = {
        expanded: false,
        setExpanded: jest.fn(),
      };
      component['parameters'] = { node: mockNode } as any;

      component.onClickExpand();

      expect(mockNode.setExpanded).toHaveBeenCalledWith(true);
      expect(component['expanded']()).toBe(true);
    });

    it('should toggle the expanded state to false when initially true', () => {
      const mockNode = {
        expanded: true,
        setExpanded: jest.fn(),
      };
      component['parameters'] = { node: mockNode } as any;

      component.onClickExpand();

      expect(mockNode.setExpanded).toHaveBeenCalledWith(false);
      expect(component['expanded']()).toBe(false);
    });

    it('should not throw an error if parameters or node are undefined', () => {
      component['parameters'] = undefined;

      expect(() => component.onClickExpand()).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should remove the "expandedChanged" event listener from the node', () => {
      const mockNode = {
        removeEventListener: jest.fn(),
      };
      component['parameters'] = { node: mockNode } as any;

      component.destroy();

      expect(mockNode.removeEventListener).toHaveBeenCalledWith(
        'expandedChanged',
        expect.any(Function)
      );
    });

    it('should not throw an error if parameters or node are undefined', () => {
      component['parameters'] = undefined;

      expect(() => component.destroy()).not.toThrow();
    });
  });

  describe('onExpand', () => {
    it('should update the expanded state to true when node is expanded', () => {
      const mockNode = {
        expanded: true,
      };
      component['parameters'] = { node: mockNode } as any;

      component['onExpand']();

      expect(component['expanded']()).toBe(true);
    });

    it('should update the expanded state to false when node is not expanded', () => {
      const mockNode = {
        expanded: false,
      };
      component['parameters'] = { node: mockNode } as any;

      component['onExpand']();

      expect(component['expanded']()).toBe(false);
    });

    it('should not throw an error if parameters or node are undefined', () => {
      component['parameters'] = undefined;

      expect(() => component['onExpand']()).not.toThrow();
    });
  });
});
