import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { ProductSelectionActions } from '@ea/core/store/actions';
import { ProductSelectionFacade } from '@ea/core/store/facades';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { MockDirective, MockModule } from 'ng-mocks';

import { SearchModule } from '@schaeffler/inputs/search';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QuickBearingSelectionComponent } from './quick-bearing-selection.component';

describe('QuickBearingSelectionComponent', () => {
  let component: QuickBearingSelectionComponent;
  let spectator: Spectator<QuickBearingSelectionComponent>;
  let productSelectionFacade: ProductSelectionFacade;

  const createComponent = createComponentFactory({
    component: QuickBearingSelectionComponent,
    imports: [
      RouterTestingModule,
      MockModule(ReactiveFormsModule),
      MockDirective(LetDirective),
      MockModule(SearchModule),
      provideTranslocoTestingModule(
        { en: {} },
        { translocoConfig: { defaultLang: 'de' } }
      ),
    ],
    providers: [
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
          bearingDesignationResultList$: of([]),
          dispatch: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    productSelectionFacade = spectator.inject(ProductSelectionFacade);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch reset bearing action', () => {
      component.ngOnInit();

      expect(productSelectionFacade.dispatch).toHaveBeenCalledWith(
        ProductSelectionActions.resetBearing()
      );
    });
  });

  describe('onSearchUpdated', () => {
    it('should dispatch search bearing', () => {
      component.onSearchUpdated('mock search');

      expect(productSelectionFacade.dispatch).toHaveBeenCalledWith(
        ProductSelectionActions.searchBearing({ query: 'mock search' })
      );
    });

    it('should reset the search', () => {
      component.onSearchUpdated('m');

      expect(productSelectionFacade.dispatch).toHaveBeenCalledWith(
        ProductSelectionActions.resetBearing()
      );

      component.onSearchUpdated(undefined);

      expect(productSelectionFacade.dispatch).toHaveBeenCalledWith(
        ProductSelectionActions.resetBearing()
      );
    });
  });

  describe('onOptionSelected', () => {
    it('should dispatch select bearing', () => {
      component.onOptionSelected({ id: 'mock_id', title: 'mock_title' });

      expect(productSelectionFacade.dispatch).toHaveBeenCalledWith(
        ProductSelectionActions.setBearingDesignation({
          bearingDesignation: 'mock_id',
          shouldNavigateToCalculationPage: true,
        })
      );
    });

    it('should reset the search', () => {
      component.onOptionSelected(undefined);

      expect(productSelectionFacade.dispatch).toHaveBeenCalledWith(
        ProductSelectionActions.resetBearing()
      );
    });
  });
});
