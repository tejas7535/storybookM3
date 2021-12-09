import { RouterTestingModule } from '@angular/router/testing';

import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SEARCH_STATE_MOCK } from '@cdba/testing/mocks/index';
import { PageHeaderModule } from '@cdba/shared/components/index';

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
