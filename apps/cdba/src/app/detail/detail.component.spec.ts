import { RouterTestingModule } from '@angular/router/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  PageHeaderModule,
  ShareButtonModule,
  TabsHeaderModule,
} from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';

import { REFERENCE_TYPE_MOCK } from '../../testing/mocks';
import { getReferenceType } from '../core/store/selectors/details/detail.selector';
import { MaterialNumberModule } from '../shared/pipes';
import { SharedModule } from '../shared/shared.module';
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
      MaterialNumberModule,
      MockModule(TabsHeaderModule),
      MockModule(PageHeaderModule),
      MockModule(ShareButtonModule),
      MockModule(BreadcrumbsModule),
    ],
    providers: [
      mockProvider(BreadcrumbsService),
      provideMockStore({
        initialState: {
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
