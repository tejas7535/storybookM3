import { RouterTestingModule } from '@angular/router/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { ShareButtonModule } from '@schaeffler/share-button';

import { PageHeaderModule, TabsHeaderModule } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';
import { ENV, getEnv } from '@cdba/environments/environment.provider';
import { getReferenceType } from '@cdba/core/store';
import { SharedModule } from '@cdba/shared';

import { AUTH_STATE_MOCK, REFERENCE_TYPE_MOCK } from '../../testing/mocks';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let spectator: Spectator<DetailComponent>;

  const createComponent = createComponentFactory({
    component: DetailComponent,
    imports: [
      SharedModule,
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(TabsHeaderModule),
      MockModule(PageHeaderModule),
      MockModule(ShareButtonModule),
      MockModule(BreadcrumbsModule),
    ],
    providers: [
      { provide: ENV, useValue: { ...getEnv() } },
      mockProvider(BreadcrumbsService),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          detail: {},
        },
        selectors: [
          {
            selector: getReferenceType,
            value: REFERENCE_TYPE_MOCK,
          },
        ],
      }),
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set referenceType$ observable', () => {
      component.ngOnInit();

      expect(component.referenceType$).toBeDefined();
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
