import { RouterTestingModule } from '@angular/router/testing';

import { PageHeaderModule } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';
import { SEARCH_STATE_MOCK } from '@cdba/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PortfolioAnalysisComponent } from './portfolio-analysis.component';

describe('PortfolioAnalysisComponent', () => {
  let spectator: Spectator<PortfolioAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: PortfolioAnalysisComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(PageHeaderModule),
      MockModule(BreadcrumbsModule),
    ],
    providers: [
      mockProvider(BreadcrumbsService),
      provideMockStore({
        initialState: {
          search: SEARCH_STATE_MOCK,
        },
      }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
