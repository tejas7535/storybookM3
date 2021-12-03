import { RouterTestingModule } from '@angular/router/testing';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { ShareButtonModule } from '@schaeffler/share-button';

import { PageHeaderModule, TabsHeaderModule } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareComponent } from './compare.component';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let spectator: Spectator<CompareComponent>;

  const createComponent = createComponentFactory({
    component: CompareComponent,
    imports: [
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      MockModule(TabsHeaderModule),
      MockModule(PageHeaderModule),
      MockModule(ShareButtonModule),
      MockModule(BreadcrumbsModule),
    ],
    providers: [
      mockProvider(BreadcrumbsService),
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
    ],
    declarations: [CompareComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
