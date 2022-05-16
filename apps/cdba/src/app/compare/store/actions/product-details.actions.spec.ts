import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import {
  loadAllProductDetails,
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
  ProductDetailsActions,
  selectCompareItems,
} from './product-details.actions';

describe('ProductDetails Actions', () => {
  let action: ProductDetailsActions;
  let expectedType: string;

  const compareItems: [
    nodeId: string,
    referenceTypeIdentifier: ReferenceTypeIdentifier
  ][] = [['1', REFERENCE_TYPE_IDENTIFIER_MOCK]];
  const index = 1;
  const errorMessage = 'Please Help';
  const statusCode = 418;
  const referenceTypeIdentifier = REFERENCE_TYPE_IDENTIFIER_MOCK;
  const referenceType = REFERENCE_TYPE_MOCK;

  afterEach(() => {
    action = undefined;
    expectedType = undefined;
  });

  describe('Reference Type Actions', () => {
    test('selectCompareItems', () => {
      action = selectCompareItems({ items: compareItems });
      expectedType = '[Compare] Select Compare Items';

      expect(action).toEqual({
        items: compareItems,
        type: expectedType,
      });
    });
  });

  describe('Product Actions', () => {
    test('loadAllProductDetails', () => {
      action = loadAllProductDetails();
      expectedType = '[Compare] Load All Product Details';

      expect(action).toEqual({
        type: expectedType,
      });
    });

    test('loadProductDetails', () => {
      action = loadProductDetails({ index, referenceTypeIdentifier });
      expectedType = '[Compare] Load Product Details';

      expect(action).toEqual({
        index,
        referenceTypeIdentifier,
        type: expectedType,
      });
    });

    test('loadProductDetailsSuccess', () => {
      action = loadProductDetailsSuccess({ index, item: referenceType });
      expectedType = '[Compare] Load Product Details Success';

      expect(action).toEqual({
        index,
        item: referenceType,
        type: expectedType,
      });
    });

    test('loadProductDetailsFailure', () => {
      action = loadProductDetailsFailure({ index, errorMessage, statusCode });
      expectedType = '[Compare] Load Product Details Failure';

      expect(action).toEqual({
        index,
        errorMessage,
        statusCode,
        type: expectedType,
      });
    });
  });
});
