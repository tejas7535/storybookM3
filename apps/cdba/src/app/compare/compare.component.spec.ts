import { provideRouter } from '@angular/router';

import { of, Subscription } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TabsHeaderModule } from '@cdba/shared/components';
import { BreadcrumbsService } from '@cdba/shared/services';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';

import { CompareComponent } from './compare.component';
import { CompareRoutePath } from './compare-route-path.enum';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let spectator: Spectator<CompareComponent>;
  let betaFeatureServiceMock: jest.Mocked<BetaFeatureService>;

  const createComponent = createComponentFactory({
    component: CompareComponent,
    detectChanges: false,
    imports: [
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(TabsHeaderModule),
      MockModule(SubheaderModule),
      MockModule(ShareButtonModule),
    ],
    providers: [
      provideRouter([]),
      mockProvider(BreadcrumbsService),
      provideMockStore({ initialState: { compare: COMPARE_STATE_MOCK } }),
      {
        provide: BetaFeatureService,
        useValue: {
          canAccessBetaFeature$: jest.fn((_betaFeature) => {}),
        },
      },
    ],
    declarations: [CompareComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    betaFeatureServiceMock = spectator.inject(
      BetaFeatureService
    ) as jest.Mocked<BetaFeatureService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not insert comparison summary tab if user is not allowed', () => {
      betaFeatureServiceMock.canAccessBetaFeature$.mockReturnValue(of(false));

      component.ngOnInit();

      expect(component.tabs).toEqual([
        {
          label: 'compare.tabs.billOfMaterial',
          link: CompareRoutePath.BomPath,
        },
        {
          label: 'compare.tabs.details',
          link: CompareRoutePath.DetailsPath,
        },
      ]);
    });
    it('should insert comparison summary tab if user is allowed', () => {
      betaFeatureServiceMock.canAccessBetaFeature$.mockReturnValue(of(true));

      component.ngOnInit();

      expect(component.tabs).toEqual([
        {
          label: 'compare.tabs.billOfMaterial',
          link: CompareRoutePath.BomPath,
        },
        {
          label: 'compare.tabs.comparisonSummary',
          link: CompareRoutePath.ComparisonSummaryPath,
          betaFeature: true,
        },
        {
          label: 'compare.tabs.details',
          link: CompareRoutePath.DetailsPath,
        },
      ]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from canAccessComparisonSummarySubscription', () => {
      component.canAccessComparisonSummarySubscription = {
        unsubscribe: jest.fn(),
      } as unknown as Subscription;

      component.ngOnDestroy();

      expect(
        component.canAccessComparisonSummarySubscription.unsubscribe
      ).toHaveBeenCalled();
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
