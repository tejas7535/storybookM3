import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { setBearingSelectionType } from '@ga/core/store';
import { setCurrentStep } from '@ga/core/store/actions/settings/settings.actions';
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
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(LetModule),
      AdvancedBearingSelectionModule,
      QuickBearingSelectionComponent,
      MockComponent(QualtricsInfoBannerComponent),
      MockModule(MatButtonModule),
    ],
    providers: [provideMockStore()],
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
