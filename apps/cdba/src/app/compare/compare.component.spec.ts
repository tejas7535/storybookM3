import { RouterTestingModule } from '@angular/router/testing';

import { TabsHeaderModule } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

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
      MockModule(SubheaderModule),
      MockModule(ShareButtonModule),
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
