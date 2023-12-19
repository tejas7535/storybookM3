import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { setBearingSelectionType, SettingsFacade } from '@ga/core/store';
import { setCurrentStep } from '@ga/core/store/actions/settings/settings.actions';
import { initialState } from '@ga/core/store/reducers/bearing-selection/bearing-selection.reducer';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';
import { BearingSelectionType } from '@ga/shared/models';

import { AppRoutePath } from '../../../app-route-path.enum';
import { BearingSelectionComponent } from './bearing-selection.component';
import { AdvancedBearingSelectionModule } from './components/advanced-bearing-selection';

describe('BearingSelectionComponent', () => {
  let component: BearingSelectionComponent;
  let spectator: Spectator<BearingSelectionComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BearingSelectionComponent,
    imports: [
      LetDirective,
      PushPipe,
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(AdvancedBearingSelectionModule),
      MockModule(SubheaderModule),
      MockComponent(QuickBearingSelectionComponent),
      MockComponent(QualtricsInfoBannerComponent),
      MockModule(MatButtonModule),
      MockModule(MatSlideToggleModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearingSelection: {
            ...initialState,
          },
        },
      }),
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: of(undefined),
          internalUser$: of(true),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
    store.select = jest
      .fn()
      .mockReturnValue(of(BearingSelectionType.QuickSelection));

    component['router'].navigate = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch step setting action', () => {
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(setCurrentStep({ step: 0 }));
    });
  });

  describe('navigateBack', () => {
    it('should navigate to landing page', () => {
      component.navigateBack();

      expect(component['router'].navigate).toHaveBeenCalledWith([
        `${AppRoutePath.BasePath}`,
      ]);
    });
  });

  describe('toggleSelection', () => {
    it('should invert detailSelection', () => {
      component.toggleBearingSelectionType({
        source: undefined,
        checked: true,
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        setBearingSelectionType({ bearingSelectionType: 'ADVANCED_SELECTION' })
      );

      component.toggleBearingSelectionType({
        source: undefined,
        checked: false,
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        setBearingSelectionType({ bearingSelectionType: 'QUICK_SELECTION' })
      );
    });
  });
});
