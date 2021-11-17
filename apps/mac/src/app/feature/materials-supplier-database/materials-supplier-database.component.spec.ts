import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';

import { MaterialsSupplierDatabaseRoutingModule } from './materials-supplier-database-routing.module';
import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';
import { initialState as initialDataState } from './store/reducers/data.reducer';

jest.mock('../../shared/change-favicon', () => ({
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
    ],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
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

  describe('shareButtonFn', () => {
    it('should share a link with query params', () => {
      const mockParams = {
        filterForm: 'some filter',
        agGridFilter: 'some ag grid filter',
      };
      store.select = jest.fn(() => of(mockParams));

      const mockTree = { queryParams: {} };
      router.parseUrl = jest.fn(() => mockTree as UrlTree);

      component['urlSerializer'].serialize = jest.fn(() => 'the url');
      component['clipboard'].copy = jest.fn();
      component['snackbar'].open = jest.fn();

      component.shareButtonFn();

      expect(store.select).toHaveBeenCalled();
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
    });
  });
});
