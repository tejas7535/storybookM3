import { RouterTestingModule } from '@angular/router/testing';

import { BreadcrumbsService } from '@cdba/shared/services';
import { SEARCH_STATE_MOCK } from '@cdba/testing/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PortfolioAnalysisComponent } from './portfolio-analysis.component';

describe('PortfolioAnalysisComponent', () => {
  let spectator: Spectator<PortfolioAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: PortfolioAnalysisComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(SubheaderModule),
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
