import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { REFERENCE_TYPE_MOCK } from '../../testing/mocks';
import { getReferenceType } from '../core/store/selectors/details/detail.selector';
import { MaterialNumberModule } from '../shared/pipes';
import { SharedModule } from '../shared/shared.module';
import { TabsHeaderModule } from '../shared/tabs-header/tabs-header.module';
import { DetailComponent } from './detail.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailComponent', () => {
  let component: DetailComponent;
  let spectator: Spectator<DetailComponent>;

  const createComponent = createComponentFactory({
    component: DetailComponent,
    imports: [
      NoopAnimationsModule,
      SharedModule,
      RouterTestingModule,
      provideTranslocoTestingModule({}),
      MaterialNumberModule,
      TabsHeaderModule,
    ],
    declarations: [DetailComponent],
    providers: [
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
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set referenceType$ observable', () => {
      // tslint:disable-next-line: no-lifecycle-call
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
