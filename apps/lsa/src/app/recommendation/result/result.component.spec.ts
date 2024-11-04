import { AddToCartService } from '@lsa/core/services/add-to-cart.service';
import { Lubricator, RecommendationResponse } from '@lsa/shared/models';
import { RecommendationTableDataPipe } from '@lsa/shared/pipes/recommendation-table-data.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AccessoryTableComponent } from './accessory-table/accessory-table.component';
import { AddToCartButtonComponent } from './add-to-cart-button/add-to-cart-button.component';
import { RecommendationTableComponent } from './recommendation-table/recommendation-table.component';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let spectator: Spectator<ResultComponent>;

  const createComponent = createComponentFactory({
    component: ResultComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(AccessoryTableComponent),
      MockComponent(RecommendationTableComponent),
      MockComponent(AddToCartButtonComponent),
      MockPipe(RecommendationTableDataPipe),
    ],
    providers: [
      {
        provide: AddToCartService,
        useValue: {
          addToCartEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRecommendationSelectedChange', () => {
    it('should set isRecommendedSelected', () => {
      component.isRecommendedSelected = true;

      component.onRecommendedSelectedChange(false);

      expect(component.isRecommendedSelected).toEqual(false);
    });
  });

  describe('onChanges', () => {
    const validResult = {
      lubricators: {
        recommendedLubricator: {
          fifteen_digit: '123',
          matnr: '001',
          qty: 0,
          name: 'Test Lubricator',
          bundle: [],
        } as Partial<Lubricator> as Lubricator,
      },
    } as Partial<RecommendationResponse> as RecommendationResponse;

    it('should set errorInstance when name is in recommendationResult', () => {
      component.recommendationResult = {
        name: 'Error',
      } as Partial<RecommendationResponse> as RecommendationResponse;

      component.ngOnChanges({});

      expect(component.errorInstance).toEqual(
        component.recommendationResult as RecommendationResponse
      );
      expect(component.validResult).toBeUndefined();
    });

    it('should set validResult when name is not in recommendationResult', () => {
      component.recommendationResult = validResult;

      component.ngOnChanges({});

      expect(component.validResult).toEqual(
        component.recommendationResult as RecommendationResponse
      );
      expect(component.isRecommendedSelected).toBeTruthy();
    });

    describe('when adding to cart', () => {
      beforeEach(() => {
        component.validResult = validResult;
        spectator.detectChanges();
      });
      it('should call addToCartEvent', () => {
        const addToCartService = spectator.inject(AddToCartService);
        const accessoryTableComponent = spectator.query(
          AccessoryTableComponent
        );
        const addToCartButtonComponent = spectator.query(
          AddToCartButtonComponent
        );

        addToCartButtonComponent.addToCart.emit();

        expect(addToCartService.addToCartEvent).toHaveBeenCalledWith(
          [...accessoryTableComponent.accessories],
          accessoryTableComponent.tableFormGroup
        );
      });
    });
  });
});
