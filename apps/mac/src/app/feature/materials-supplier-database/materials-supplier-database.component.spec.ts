import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';

import * as en from '../../../assets/i18n/en.json';
import { MaterialClass, NavigationLevel } from './constants';
import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';
import { MaterialsSupplierDatabaseRoutingModule } from './materials-supplier-database-routing.module';

jest.mock('@mac/shared/change-favicon', () => ({
  changeFavicon: jest.fn(() => {}),
}));

describe('MaterialsSupplierDatabaseComponent', () => {
  let component: MaterialsSupplierDatabaseComponent;
  let spectator: Spectator<MaterialsSupplierDatabaseComponent>;
  let store: MockStore;
  let router: Router;

  const initialState = { msd: { data: initialDataState } };

  const createComponent = createComponentFactory({
    component: MaterialsSupplierDatabaseComponent,
    imports: [
      CommonModule,
      MaterialsSupplierDatabaseRoutingModule,
      RouterTestingModule,
      SubheaderModule,
      ShareButtonModule,
      HttpClientTestingModule,
      MatButtonModule,
      MatSnackBarModule,
      MatIconModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [MaterialsSupplierDatabaseComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);

    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should log open event', () => {
      component.ngOnInit();

      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] opened');
    });
  });

  describe('shareButtonFn', () => {
    it('should share a link with query params', () => {
      const mockParams = {
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        agGridFilter: 'some ag grid filter',
      };
      component['dataFacade'].shareQueryParams$ = of(mockParams);

      const mockTree = { queryParams: {} };
      router.parseUrl = jest.fn(() => mockTree as UrlTree);

      component['urlSerializer'].serialize = jest.fn(() => 'the url');
      component['clipboard'].copy = jest.fn();
      component['snackbar'].open = jest.fn();

      component.shareButtonFn();

      expect(router.parseUrl).toHaveBeenCalled();
      expect(component['urlSerializer'].serialize).toHaveBeenCalledWith({
        ...mockTree,
        queryParams: mockParams,
      });
      expect(component['clipboard'].copy).toHaveBeenCalled();
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        'Link copied to clipboard',
        'Close'
      );
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Share link copied', {
        tooLong: false,
      });
    });

    it('should display an error snackbar if the share link is too long', () => {
      const mockParams = {
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
        agGridFilter: 'some ag grid filter',
      };
      component['dataFacade'].shareQueryParams$ = of(mockParams);

      const mockTree = { queryParams: {} };
      router.parseUrl = jest.fn(() => mockTree as UrlTree);

      component['urlSerializer'].serialize = jest.fn(
        () =>
          'the url which is very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long'
      );
      component['clipboard'].copy = jest.fn();
      component['snackbar'].open = jest.fn();

      component.shareButtonFn();

      expect(router.parseUrl).toHaveBeenCalled();
      expect(component['urlSerializer'].serialize).toHaveBeenCalledWith({
        ...mockTree,
        queryParams: mockParams,
      });
      expect(component['clipboard'].copy).not.toHaveBeenCalled();
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        'The table filter is too long to be put into a link',
        'Close'
      );
      expect(
        component['applicationInsightsService'].logEvent
      ).toHaveBeenCalledWith('[MAC - MSD] Share link copied', {
        tooLong: true,
      });
    });
  });
});
