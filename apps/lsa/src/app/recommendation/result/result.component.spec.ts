import { SimpleChanges } from '@angular/core';

import { AddToCartService } from '@lsa/core/services/add-to-cart.service';
import { GoogleAnalyticsService } from '@lsa/core/services/google-analytics';
import { PDFGeneratorService } from '@lsa/core/services/pdf-generation/pdf-generator.service';
import { Lubricator, RecommendationResponse } from '@lsa/shared/models';
import { RecommendationTableDataPipe } from '@lsa/shared/pipes/recommendation-table-data.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AccessoryTableComponent } from './accessory-table/accessory-table.component';
import { AddToCartButtonComponent } from './add-to-cart-button/add-to-cart-button.component';
import { ErrorContainerComponent } from './error-container/error-container.component';
import { RecommendationTableComponent } from './recommendation-table/recommendation-table.component';
import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let spectator: Spectator<ResultComponent>;
  let googleAnalyticsService: GoogleAnalyticsService;

  const googleAnalyticsServiceMock = {
    logEvent: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: ResultComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(AccessoryTableComponent),
      MockComponent(RecommendationTableComponent),
      MockComponent(AddToCartButtonComponent),
      MockComponent(ErrorContainerComponent),
      MockPipe(RecommendationTableDataPipe),
    ],
    providers: [
      {
        provide: AddToCartService,
        useValue: {
          addToCartEvent: jest.fn(),
          getUserTier: jest.fn(),
        },
      },
      {
        provide: GoogleAnalyticsService,
        useValue: googleAnalyticsServiceMock,
      },
      {
        provide: PDFGeneratorService,
        useValue: {
          generatePDF: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    googleAnalyticsService = spectator.inject(GoogleAnalyticsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRecommendationSelectedChange', () => {
    it('should set isRecommendedSelected', () => {
      component.isRecommendedSelected = true;

      component.onRecommendedSelectedChange(false);

      expect(component.isRecommendedSelected).toEqual(false);

      expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith({
        action: 'Product Selection',
        event: 'lsa_related_interaction',
        selected_product_type: 'Minimum',
        step: 4,
        step_name: 'Result',
      });
    });
  });

  describe('onChanges', () => {
    const validResult = {
      lubricators: {
        recommendedLubricator: {
          fifteen_digit: '123',
          matNr: '001',
          qty: 0,
          name: 'Test Lubricator',
          bundle: [],
        } as Partial<Lubricator> as Lubricator,
        minimumRequiredLubricator: {
          fifteen_digit: '123',
          matNr: '001',
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

      const simpleChanges: SimpleChanges = {
        recommendationResult: {
          currentValue: component.recommendationResult,
          firstChange: false,
          previousValue: component.recommendationResult,
          isFirstChange: () => false,
        },
      };
      component.ngOnChanges(simpleChanges);

      expect(component.errorInstance).toEqual(
        component.recommendationResult as RecommendationResponse
      );
      expect(component.validResult).toBeUndefined();

      expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith({
        action: 'Step Load Fail',
        event: 'lsa_related_interaction',
        step: 4,
        step_name: 'Result',
      });
    });

    it('should set validResult when name is not in recommendationResult', () => {
      component.recommendationResult = validResult;
      const changes: SimpleChanges = {
        recommendationResult: {},
      } as unknown as Partial<SimpleChanges> as SimpleChanges;

      component.ngOnChanges(changes);

      expect(component.validResult).toEqual(
        component.recommendationResult as RecommendationResponse
      );
      expect(component.isRecommendedSelected).toBeTruthy();
    });

    describe('when on init is called', () => {
      describe('when validResult is defined', () => {
        beforeEach(() => {
          component.validResult = validResult;
          component.ngOnInit();
        });

        it('should log result page load event', () => {
          expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith({
            action: 'Step Load',
            event: 'lsa_related_interaction',
            min_prod: {
              id: '001',
              name: 'Test Lubricator',
            },
            recom_prod: {
              id: '001',
              name: 'Test Lubricator',
            },
            step: 4,
            step_name: 'Result',
          });
        });
      });

      describe('when validResult is udefined', () => {
        beforeEach(() => {
          googleAnalyticsServiceMock.logEvent.mockReset();
          component.validResult = undefined;
          component.ngOnInit();
        });

        it('should not log result page load event', () => {
          expect(googleAnalyticsService.logEvent).not.toHaveBeenCalled();
        });
      });
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

        expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith({
          action: 'Add to Cart',
          event: 'lsa_related_interaction',
          product_parts: [],
          selected_product_quantity: 1,
          selected_product_type: 'Recommended',
          step: 4,
          step_name: 'Result',
        });
      });
    });

    it('should log link to support click', () => {
      const errorContainer = spectator.query(ErrorContainerComponent);

      errorContainer.errorLinkClicked.emit();

      expect(googleAnalyticsService.logEvent).toHaveBeenCalledWith({
        action: 'Click to Support',
        event: 'lsa_related_interaction',
        step: 4,
        step_name: 'Result',
      });
    });
  });

  describe('when setting price and availability responses multiple times', () => {
    it('should set price and availability responses as an combined result', () => {
      spectator.setInput('priceAndAvailabilityResponses', {
        items: {
          '123456': {},
          '654321': {},
        },
      });

      spectator.setInput('priceAndAvailabilityResponses', {
        items: {
          '2222': {},
          '3333': {},
        },
      });

      expect(component.pricesAndAvailability).toMatchSnapshot();
    });
  });
});
