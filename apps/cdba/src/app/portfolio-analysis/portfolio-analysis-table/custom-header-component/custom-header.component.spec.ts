import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgGridModule } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';
import { MockModule, MockProvider } from 'ng-mocks';

import { deselectReferenceType } from '@cdba/core/store/actions/search/search.actions';

import { PortfolioAnalysisTableService } from '../portfolio-analysis-table.service';
import { CustomHeaderComponent } from './custom-header.component';

describe('CustomHeaderComponent', () => {
  let spectator: Spectator<CustomHeaderComponent>;
  let component: CustomHeaderComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CustomHeaderComponent,
    imports: [
      MockModule(AgGridModule),
      MockModule(CommonModule),
      MockModule(MatIconModule),
    ],
    providers: [
      MockProvider(PortfolioAnalysisTableService),
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    spectator = createComponent({
      props: {
        params: { displayName: '' } as IHeaderParams,
      },
    });
    component = spectator.component;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isXButtonVisible to false', () => {
    expect(component.isXButtonVisible).toBeFalsy();
  });

  describe('mouse events', () => {
    it('should set isXButtonVisible to true on mouse over', () => {
      component.isXButtonVisible = false;

      component.onMouseOver();

      expect(component.isXButtonVisible).toEqual(true);
    });
    it('should set isXButtonVisible to false on mouse leave', () => {
      component.isXButtonVisible = true;

      component.onMouseLeave();

      expect(component.isXButtonVisible).toEqual(false);
    });
  });

  describe('store', () => {
    it('should dispatch deselectReferenceType action on xButtonClicked', () => {
      const nodeId = '123';
      const action = deselectReferenceType({ nodeId });
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.xButtonClicked(nodeId);

      expect(dispatchSpy).toHaveBeenCalledWith(action);
    });
  });

  describe('refresh', () => {
    it('should return false from refresh', () => {
      const params = { displayName: '' } as IHeaderParams;

      const result = component.refresh(params);

      expect(result).toBe(false);
    });
  });

  describe('agInit', () => {
    it('should set the params and nodeId', () => {
      const params = {
        params: { displayName: '' } as IHeaderParams,
        nodeId: '123',
      } as any;

      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component.nodeId).toEqual(params.nodeId);
    });
  });
});
