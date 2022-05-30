import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { setCurrentStep } from '@ga/core/store/actions/settings/settings.actions';

import { AppRoutePath } from '../app-route-path.enum';
import { AdvancedBearingSelectionModule } from './advanced-bearing-selection';
import { BearingComponent } from './bearing.component';
import { QuickBearingSelectionModule } from './quick-bearing-selection';

describe('BearingComponent', () => {
  let component: BearingComponent;
  let spectator: Spectator<BearingComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: BearingComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(AdvancedBearingSelectionModule),
      MockModule(QuickBearingSelectionModule),
      MockModule(SubheaderModule),
      MockModule(MatButtonModule),
    ],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);

    store.dispatch = jest.fn();
    component['router'].navigate = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set advanced bearing selection as default', () => {
    expect(component.advancedBearingSelectionActive).toBeTruthy();
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
      component.advancedBearingSelectionActive = false;
      component.toggleBearingSelectionType();

      expect(component.advancedBearingSelectionActive).toBe(true);
    });
  });
});
