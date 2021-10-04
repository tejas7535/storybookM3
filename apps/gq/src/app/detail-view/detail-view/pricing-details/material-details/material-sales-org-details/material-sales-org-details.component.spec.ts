import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
      ReactiveComponentModule,
      LabelTextModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore({ initialState: { materialSalesOrgs: {} } })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
