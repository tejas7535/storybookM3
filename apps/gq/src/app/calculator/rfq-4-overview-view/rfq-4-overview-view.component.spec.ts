import { signal } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockBuilder } from 'ng-mocks';

import { Rfq4OverviewViewComponent } from './rfq-4-overview-view.component';
import { Rfq4OverviewStore } from './store/rfq-4-overview.store';

describe('Rfq-4-OverviewViewComponent', () => {
  let component: Rfq4OverviewViewComponent;
  let spectator: Spectator<Rfq4OverviewViewComponent>;
  let router: Router;

  const dependencies = MockBuilder(Rfq4OverviewViewComponent)
    .mock(Rfq4OverviewStore, {
      items: {
        activeTab: signal('DONE'),
      },
      loadCountFromInterval: jest.fn(),
      stopCountTimer: jest.fn(),
    })
    .mock(Router, {
      navigate: jest.fn(),
    })
    .build();

  const createComponent = createComponentFactory({
    component: Rfq4OverviewViewComponent,
    ...dependencies,
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should start Count timer', () => {
      component.ngOnInit();

      expect(
        component['rfq4OverviewStore'].loadCountFromInterval
      ).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should stop count timer', () => {
      component.ngOnDestroy();

      expect(component['rfq4OverviewStore'].stopCountTimer).toHaveBeenCalled();
    });
  });

  describe('onViewToggle', () => {
    test('should call loadItemsForView with the view id', () => {
      const viewId = 1;
      const view = { id: viewId } as any;
      component['rfq4OverviewStore'].updateActiveTabByViewId = jest.fn();

      component.onViewToggle(view);

      expect(
        component['rfq4OverviewStore'].updateActiveTabByViewId
      ).toHaveBeenCalledWith(viewId);
    });
  });

  describe('navToCaseOverview', () => {
    it('should navigate to case view path', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.navToCaseOverview();

      expect(navigateSpy).toHaveBeenCalledWith([AppRoutePath.CaseViewPath]);
    });
  });
});
