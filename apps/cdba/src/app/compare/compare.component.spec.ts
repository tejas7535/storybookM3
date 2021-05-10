import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TabsHeaderModule } from '@cdba/shared/components';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareComponent } from './compare.component';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let spectator: Spectator<CompareComponent>;

  const createComponent = createComponentFactory({
    component: CompareComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      TabsHeaderModule,
    ],
    providers: [
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
