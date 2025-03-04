import { signal } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { DetailedCustomerSalesPlan } from '../../../../../../../feature/sales-planning/model';
import { SalesPlanningGroupLevelCellRendererComponent } from './sales-planning-group-level-cell-renderer.component';

describe('SalesPlanningGroupLevelCellRendererComponent', () => {
  let spectator: Spectator<SalesPlanningGroupLevelCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: SalesPlanningGroupLevelCellRendererComponent,
    detectChanges: false,
  });

  let mockParams: ICellRendererParams<any, DetailedCustomerSalesPlan> & {
    clickAction: jest.Mock;
  };

  beforeEach(() => {
    mockParams = {
      node: {
        level: 1,
        group: true,
        expanded: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        setExpanded: jest.fn(),
      },
      data: {
        planningMaterial: 'I03',
        planningMaterialText: 'Bearings',
        planningYear: '2025',
      },
      clickAction: jest.fn(),
    } as any;

    spectator = createComponent();
    spectator.component.agInit(mockParams);
    spectator.detectChanges();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should correctly set value based on node level and data', () => {
    expect(spectator.component.value).toBe('I03 - Bearings');
  });

  it('should determine if the node is a group', () => {
    expect(spectator.component.isGroup).toBe(true);
  });

  it('should determine if the node is a child element', () => {
    expect(spectator.component.isChildElement).toBe(true);
  });

  it('should call onClickAction with rowData and correct flag when clicked', () => {
    spectator.click('span.cursor-pointer');
    expect(mockParams.clickAction).toHaveBeenCalledWith(mockParams.data, false);
  });

  it('should toggle expansion state when expand element is clicked', () => {
    spectator.component.expanded = signal(false);
    spectator.detectChanges();

    spectator.click('[data-ref="eContracted"]');
    expect(mockParams.node.setExpanded).toHaveBeenCalledWith(true);
  });

  it('should update expanded state when event listener is triggered', () => {
    spectator.component.expanded.set(false);
    spectator.detectChanges();

    mockParams.node.expanded = true;
    spectator.component['onExpand']();
    expect(spectator.component.expanded()).toBe(true);
  });

  it('should remove event listener on destroy', () => {
    spectator.component.destroy();
    expect(mockParams.node.removeEventListener).toHaveBeenCalledWith(
      'expandedChanged',
      spectator.component['onExpand']
    );
  });
});
