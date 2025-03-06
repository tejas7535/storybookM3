import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MaterialClass,
  NavigationLevel,
} from '@mac/feature/materials-supplier-database/constants';
import {
  ActiveNavigationLevel,
  QuickFilter,
} from '@mac/feature/materials-supplier-database/models';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { QuickFilterFacade } from '@mac/feature/materials-supplier-database/store/facades/quickfilter';

import * as en from '../../../../../../assets/i18n/en.json';
import { QuickfilterDialogComponent } from '../quickfilter-dialog/quickfilter-dialog.component';
import { QuickFilterManagementComponent } from './quick-filter-management.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('QuickFilterManagementComponent', () => {
  let component: QuickFilterManagementComponent;
  let spectator: Spectator<QuickFilterManagementComponent>;

  const createComponent = createComponentFactory({
    component: QuickFilterManagementComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      mockProvider(DataFacade),
      mockProvider(QuickFilterFacade, { ownQuickFilters$: of() }),
      mockProvider(MatDialog),
      provideRouter([]),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should reset queried quick filters on destroy', () => {
    component.quickFilterFacade.resetQueriedQuickFilters = jest.fn();

    component.ngOnDestroy();

    expect(
      component.quickFilterFacade.resetQueriedQuickFilters
    ).toHaveBeenCalledTimes(1);
  });

  test('should activate quick filter on edit', () => {
    const quickFilter: QuickFilter = {
      id: 500,
      title: 'Test',
      description: 'Test filter',
      filter: {
        co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
      },
      columns: [],
    };

    component.quickFilterFacade.activateQuickFilter = jest.fn();

    component['edit'](quickFilter);

    expect(
      component.quickFilterFacade.activateQuickFilter
    ).toHaveBeenCalledWith(quickFilter);
  });

  test('should subscribe quick filter', () => {
    const quickFilter: QuickFilter = {
      id: 999,
      title: 'Test',
      description: 'Test filter',
      filter: {
        co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
      },
      columns: [],
    };

    component.quickFilterFacade.subscribeQuickFilter = jest.fn();

    component['subscribe'](quickFilter);

    expect(
      component.quickFilterFacade.subscribeQuickFilter
    ).toHaveBeenCalledWith(quickFilter);
  });

  test('should unsubscribe quick filter', () => {
    const quickFilter: QuickFilter = {
      id: 888,
      title: 'Test',
      description: 'Test filter',
      filter: {
        co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
      },
      columns: [],
    };

    component.quickFilterFacade.unsubscribeQuickFilter = jest.fn();

    component['unsubscribe'](quickFilter);

    expect(
      component.quickFilterFacade.unsubscribeQuickFilter
    ).toHaveBeenCalledWith(quickFilter.id);
  });

  test('should enable quick filter notification', () => {
    const quickFilter = {
      id: 888,
    } as QuickFilter;

    component.quickFilterFacade.enableQuickFilterNotification = jest.fn();

    component['enableNotification'](quickFilter, false);

    expect(
      component.quickFilterFacade.enableQuickFilterNotification
    ).toHaveBeenCalledWith(quickFilter.id, false);
  });

  test('should disable quick filter notification', () => {
    const quickFilter = {
      id: 888,
    } as QuickFilter;

    component.quickFilterFacade.disableQuickFilterNotification = jest.fn();

    component['disableNotification'](quickFilter, true);

    expect(
      component.quickFilterFacade.disableQuickFilterNotification
    ).toHaveBeenCalledWith(quickFilter.id, true);
  });

  describe('shouldDisableWriteOperation', () => {
    test('should not disable if quick filter is local', (done) => {
      const quickFilter: QuickFilter = {
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['shouldDisableWriteOperation'](quickFilter).subscribe(
        (shouldDisable: boolean) => {
          expect(shouldDisable).toBe(false);
          done();
        }
      );
    });

    test('should disable if quick filter is public and user does not have the EDITOR role', (done) => {
      const quickFilter: QuickFilter = {
        id: 100,
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['dataFacade'].hasEditorRole$ = of(false);

      component['shouldDisableWriteOperation'](quickFilter).subscribe(
        (shouldDisable: boolean) => {
          expect(shouldDisable).toBe(true);
          done();
        }
      );
    });

    test('should not disable if quick filter is public and user has the EDITOR role', (done) => {
      const quickFilter: QuickFilter = {
        id: 100,
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['dataFacade'].hasEditorRole$ = of(true);

      component['shouldDisableWriteOperation'](quickFilter).subscribe(
        (shouldDisable: boolean) => {
          expect(shouldDisable).toBe(false);
          done();
        }
      );
    });
  });

  describe('search', () => {
    test('should trigger search on ngOnInit', () => {
      component['search'] = jest.fn();

      component.ngOnInit();

      expect(component['search']).toHaveBeenCalledWith('');
    });
    test('should trigger search', () => {
      const searchExpression = 'test';
      const activateNavigation: ActiveNavigationLevel = {
        materialClass: MaterialClass.STEEL,
        navigationLevel: NavigationLevel.MATERIAL,
      };

      component.quickFilterFacade.queryQuickFilters = jest.fn();
      component.activeNavigationLevel = activateNavigation;

      component['search'](searchExpression);

      expect(
        component.quickFilterFacade.queryQuickFilters
      ).toHaveBeenCalledWith(
        activateNavigation.materialClass,
        activateNavigation.navigationLevel,
        searchExpression
      );
    });
  });

  describe('delete', () => {
    test('should trigger delete', () => {
      const quickFilter: QuickFilter = {
        id: 100,
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of({ delete: true }),
          }) as MatDialogRef<any>
      );

      component.quickFilterFacade.deleteQuickFilter = jest.fn();

      component['delete'](quickFilter);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        QuickfilterDialogComponent,
        {
          width: '500px',
          autoFocus: false,
          data: { quickFilter, edit: false, delete: true },
        }
      );
      expect(
        component.quickFilterFacade.deleteQuickFilter
      ).toHaveBeenCalledWith(quickFilter);
    });

    test('should not trigger delete', () => {
      const quickFilter: QuickFilter = {
        id: 100,
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of({ delete: false }),
          }) as MatDialogRef<any>
      );

      component.quickFilterFacade.deleteQuickFilter = jest.fn();

      component['delete'](quickFilter);

      expect(
        component.quickFilterFacade.deleteQuickFilter
      ).not.toHaveBeenCalled();
    });
  });

  describe('shouldHideEnableNotification', () => {
    test('should hide for local filters', (done) => {
      const quickFilter: QuickFilter = {
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['shouldHideEnableNotification'](quickFilter).subscribe(
        (shouldHide: boolean) => {
          expect(shouldHide).toBe(true);
          done();
        }
      );
    });

    test('should hide if notification already enabled', (done) => {
      const quickFilter = {
        id: 20,
        notificationEnabled: true,
      } as QuickFilter;

      component['shouldHideEnableNotification'](quickFilter).subscribe(
        (shouldHide: boolean) => {
          expect(shouldHide).toBe(true);
          done();
        }
      );
    });

    test('should not hide if notification not enabled', (done) => {
      const quickFilter = {
        id: 20,
        notificationEnabled: false,
      } as QuickFilter;

      component['shouldHideEnableNotification'](quickFilter).subscribe(
        (shouldHide: boolean) => {
          expect(shouldHide).toBe(false);
          done();
        }
      );
    });
  });

  describe('shouldHideDisableNotification', () => {
    test('should hide for local filters', (done) => {
      const quickFilter: QuickFilter = {
        title: 'Test',
        description: 'Test filter',
        filter: {
          co2PerTon: { filterType: 'number', type: 'greaterThan', filter: 0 },
        },
        columns: [],
      };

      component['shouldHideDisableNotification'](quickFilter).subscribe(
        (shouldHide: boolean) => {
          expect(shouldHide).toBe(true);
          done();
        }
      );
    });

    test('should hide if notification not enabled', (done) => {
      const quickFilter = {
        id: 20,
        notificationEnabled: false,
      } as QuickFilter;

      component['shouldHideDisableNotification'](quickFilter).subscribe(
        (shouldHide: boolean) => {
          expect(shouldHide).toBe(true);
          done();
        }
      );
    });

    test('should not hide if notification enabled', (done) => {
      const quickFilter = {
        id: 20,
        notificationEnabled: true,
      } as QuickFilter;

      component['shouldHideDisableNotification'](quickFilter).subscribe(
        (shouldHide: boolean) => {
          expect(shouldHide).toBe(false);
          done();
        }
      );
    });
  });
});
