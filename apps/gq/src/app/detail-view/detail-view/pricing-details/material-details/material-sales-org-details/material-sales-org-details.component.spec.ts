import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MATERIAL_SALES_ORG_STATE_MOCK } from '../../../../../../testing/mocks';
import { LabelTextModule } from '../../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../../shared/pipes/shared-pipes.module';
import { MaterialSalesOrgDetailsComponent } from './material-sales-org-details.component';

describe('MaterialSalesOrgDetailsComponent', () => {
  let component: MaterialSalesOrgDetailsComponent;
  let spectator: Spectator<MaterialSalesOrgDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialSalesOrgDetailsComponent,
    imports: [
      SharedPipesModule,
      PushModule,
      LabelTextModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: { materialSalesOrg: MATERIAL_SALES_ORG_STATE_MOCK },
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
    test(
      'should init observables',
      marbles((m) => {
        m.expect(component.materialSalesOrg$).toBeObservable(
          m.cold('a', { a: MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrg })
        );
        m.expect(component.materialSalesOrgDataAvailable$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });
});
