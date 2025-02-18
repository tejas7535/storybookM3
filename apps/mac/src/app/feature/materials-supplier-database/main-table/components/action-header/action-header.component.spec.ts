import { Subject } from 'rxjs';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { IHeaderParams, IRowNode } from 'ag-grid-community';
import { MockPipe } from 'ng-mocks';

import { DataFacade } from '@mac/msd/store/facades/data';

import { ActionHeaderComponent } from './action-header.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string.split('.').pop()),
}));

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
          isBulkEditAllowed$: new Subject<boolean>(),
        },
      },
    ],
  });

  beforeEach(() => {
    mockParams = {
      api: {
        addEventListener: jest.fn(),
        getSelectedNodes: jest.fn(() => [] as IRowNode[]),
        deselectAll: jest.fn(),
        selectAllFiltered: jest.fn(),
        getRenderedNodes: jest.fn(() => [] as IRowNode[]),
      },
    } as unknown as IHeaderParams;

    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockParams);
  });

  describe('agInit', () => {
    it('should build', () => {
      expect(component).toBeTruthy();
      expect(component.checkBoxStyle).toBeTruthy();
      expect(mockParams.api.addEventListener).toHaveBeenCalledWith(
        'selectionChanged',
        expect.any(Function)
      );
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });

  describe('setCheckBoxStyle', () => {
    // order is important because of observable being "remembered"
    it('should display checked checkbox', () => {
      component['isAllSelected'] = jest.fn(() => true);
      component['isAnySelected'] = jest.fn(() => false);
      component['setCheckBoxStyle']();

      expect(component.checkBoxStyle).toBe('check_box');
    });
    it('should display intermediate checkbox', () => {
      component['isAllSelected'] = jest.fn(() => false);
      component['isAnySelected'] = jest.fn(() => true);
      component['setCheckBoxStyle']();

      expect(component.checkBoxStyle).toBe('indeterminate_check_box');
    });
    it('should display unchecked checkbox', () => {
      component['isAllSelected'] = jest.fn(() => false);
      component['isAnySelected'] = jest.fn(() => false);
      component['setCheckBoxStyle']();

      expect(component.checkBoxStyle).toBe('check_box_outline_blank');
    });
  });

  describe('onSelectClick', () => {
    it('should deselect all items', () => {
      component['isAllSelected'] = jest.fn(() => true);

      const trigger = jest.fn();
      mockParams.api.deselectAll = trigger;
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
      const trigger = jest.fn(() => [{} as IRowNode]);
      mockParams.api.getSelectedNodes = trigger;

      expect(component['isAnySelected']()).toBe(true);
    });
    it('should detect that no items are selected', () => {
      const trigger = jest.fn(() => [] as IRowNode[]);
      mockParams.api.getSelectedNodes = trigger;

      expect(component['isAnySelected']()).toBe(false);
    });
  });

  describe('isAllSelected', () => {
    const getArray = (count: number) =>
      jest.fn(() => Array.from({ length: count }).fill({}) as IRowNode[]);
    it('should detect that all items are selected', () => {
      mockParams.api.getRenderedNodes = getArray(3);
      mockParams.api.getSelectedNodes = getArray(3);

      expect(component['isAllSelected']()).toBe(true);
    });
    it('should detect that all items are selected but only a few are rendered', () => {
      mockParams.api.getRenderedNodes = getArray(3);
      mockParams.api.getSelectedNodes = getArray(30);

      expect(component['isAllSelected']()).toBe(true);
    });
    it('should detect that not all items are selected', () => {
      mockParams.api.getRenderedNodes = getArray(5);
      mockParams.api.getSelectedNodes = getArray(3);

      expect(component['isAllSelected']()).toBe(false);
    });
    it('should detect that no items are selected', () => {
      mockParams.api.getRenderedNodes = getArray(3);
      mockParams.api.getSelectedNodes = getArray(0);

      expect(component['isAllSelected']()).toBe(false);
    });
    it('should detect that no items are present', () => {
      mockParams.api.getRenderedNodes = getArray(0);
      mockParams.api.getSelectedNodes = getArray(0);

      expect(component['isAllSelected']()).toBe(false);
    });
  });
});
