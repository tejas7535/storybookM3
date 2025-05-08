import { signal } from '@angular/core';

import { CalculatorPaths } from '@gq/calculator/routing/calculator-routes';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { CalculatorTab } from '../models/calculator-tab.enum';
import { Rfq4OverviewFacade } from './rfq-4-overview.facade';
import { Rfq4OverviewStore } from './rfq-4-overview.store';

describe('Rfq4OverviewFacade', () => {
  let service: Rfq4OverviewFacade;
  let spectator: SpectatorService<Rfq4OverviewFacade>;
  const activeTabSignal = signal(CalculatorTab.OPEN);

  const itemsSignal = signal({ activeTab: activeTabSignal });

  const createService = createServiceFactory({
    service: Rfq4OverviewFacade,
    providers: [
      provideMockStore({}),
      mockProvider(Rfq4OverviewStore, {
        items: itemsSignal,
        getViewToggles: signal([]),
        getItemsForTab: signal(['hello']),
        updateActiveTab: jest.fn(),
        updateActiveTabByViewId: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('SignalsToProvide', () => {
    test('should provide rfq4CalculatorViews', () => {
      expect(service.rfq4CalculatorViews).toBeDefined();
      expect(service.rfq4CalculatorViews()).toEqual([]);
    });
    test('should provide rfq4CalculatorItemsForTab', () => {
      expect(service.rfq4CalculatorItemsForTab).toBeDefined();
      expect(service.rfq4CalculatorItemsForTab()).toEqual(['hello']);
    });
  });

  describe('Methods', () => {
    describe('setActiveTab', () => {
      test('should call updateActiveTab and location.go with correct parameters', () => {
        const activeTab = CalculatorTab.IN_PROGRESS;
        service['location'].go = jest.fn();
        // update the store Value manually
        activeTabSignal.update(() => CalculatorTab.IN_PROGRESS);
        service.setActiveTab(activeTab);

        expect(
          service['rfq4OverviewStore'].updateActiveTab
        ).toHaveBeenCalledWith(activeTab);

        expect(service['location'].go).toHaveBeenCalledWith(
          `${CalculatorPaths.CalculatorOverviewPath}/${itemsSignal().activeTab}`
        );
      });
    });

    describe('loadItemsForView', () => {
      test('should call updateActiveTabByViewId and location.go with correct parameters', () => {
        const viewId = 1;
        service['location'].go = jest.fn();
        // update the store Value manually
        activeTabSignal.update(() => CalculatorTab.IN_PROGRESS);
        service.loadItemsForView(viewId);

        expect(
          service['rfq4OverviewStore'].updateActiveTabByViewId
        ).toHaveBeenCalledWith(viewId);

        expect(service['location'].go).toHaveBeenCalledWith(
          `${CalculatorPaths.CalculatorOverviewPath}/${itemsSignal().activeTab}`
        );
      });
    });
  });
});
