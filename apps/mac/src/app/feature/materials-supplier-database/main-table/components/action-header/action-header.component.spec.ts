import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { IHeaderParams, RowNode } from 'ag-grid-community';
import { MockPipe } from 'ng-mocks';

import { DataFacade } from '@mac/msd/store/facades/data';

import { ActionHeaderComponent } from './action-header.component';

describe('ActionHeaderComponent', () => {
  let component: ActionHeaderComponent;
  let spectator: Spectator<ActionHeaderComponent>;

  let mockParams: IHeaderParams;

  const createComponent = createComponentFactory({
    component: ActionHeaderComponent,
    imports: [MockPipe(PushPipe)],
    providers: [
      {
        provide: DataFacade,
        useValue: {
          // isBulkEditAllowed$: new Subject<boolean>(),
        },
      },
    ],
  });

  beforeEach(() => {
    mockParams = { api: {} } as IHeaderParams;

    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = mockParams;
  });

  describe('agInit', () => {
    it('should build', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('getCheckBoxStyle', () => {
    // order is important because of observable being "remembered"
    it('should display checked checkbox', () => {
      component['isAllSelected'] = jest.fn(() => true);
      component['isAnySelected'] = jest.fn(() => false);

      expect(component.getCheckBoxStyle()).toBe('check_box');
    });
    it('should display intermediate checkbox', () => {
      component['isAllSelected'] = jest.fn(() => false);
      component['isAnySelected'] = jest.fn(() => true);

      expect(component.getCheckBoxStyle()).toBe('indeterminate_check_box');
    });
    it('should display unchecked checkbox', () => {
      component['isAllSelected'] = jest.fn(() => false);
      component['isAnySelected'] = jest.fn(() => false);

      expect(component.getCheckBoxStyle()).toBe('check_box_outline_blank');
    });
  });

  describe('onSelectClick', () => {
    it('should deselect all items', () => {
      component['isAllSelected'] = jest.fn(() => true);

      const trigger = jest.fn();
      mockParams.api.deselectAllFiltered = trigger;
      component.onSelectClick();

      expect(trigger).toHaveBeenCalled();
    });
    it('should select all items', () => {
      component['isAllSelected'] = jest.fn(() => false);

      const trigger = jest.fn();
      mockParams.api.selectAllFiltered = trigger;
      component.onSelectClick();

      expect(trigger).toHaveBeenCalled();
    });
  });

  describe('isAnySelected', () => {
    it('should detect that items are selected', () => {
      const trigger = jest.fn(() => [{} as RowNode]);
      mockParams.api.getSelectedNodes = trigger;

      expect(component['isAnySelected']()).toBe(true);
    });
    it('should detect that no items are selected', () => {
      const trigger = jest.fn(() => []);
      mockParams.api.getSelectedNodes = trigger;

      expect(component['isAnySelected']()).toBe(false);
    });
  });

  describe('isAllSelected', () => {
    const getNode = (selected: boolean) =>
      ({ isSelected: () => selected }) as RowNode;

    it('should detect that all items are selected', () => {
      mockParams.api.getRenderedNodes = jest.fn(() => [
        getNode(true),
        getNode(true),
        getNode(true),
      ]);
      mockParams.api.getDisplayedRowCount = jest.fn(() => 3);
      expect(component['isAllSelected']()).toBe(true);
    });
    it('should detect that not all items are selected', () => {
      mockParams.api.getRenderedNodes = jest.fn(() => [
        getNode(true),
        getNode(false),
        getNode(true),
      ]);

      expect(component['isAllSelected']()).toBe(false);
    });
    it('should detect that no items are selected', () => {
      mockParams.api.getRenderedNodes = jest.fn(() => []);

      expect(component['isAllSelected']()).toBe(true);
    });
  });
});
