import { HttpStatusCode } from '@angular/common/http';

import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import { REFERENCE_TYPE_MOCK } from '@cdba/testing/mocks';

import {
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  ProductDetailsActions,
  selectReferenceType,
} from './product-details.actions';

describe('Product Details Actions', () => {
  let action: ProductDetailsActions;
  let referenceTypeIdentifier: ReferenceTypeIdentifier;
  const errorMessage = 'An error occured';
  const statusCode = HttpStatusCode.BadRequest;

  beforeEach(() => {
    action = undefined;

    referenceTypeIdentifier = {
      materialNumber: '1234',
      plant: 'Beautiful Plant',
    };
  });

  test('selectReferenceType', () => {
    action = selectReferenceType({ referenceTypeIdentifier });

    expect(action).toEqual({
      referenceTypeIdentifier,
      type: '[Detail] Select Reference Type',
    });
  });

  describe('loadReferenceType Actions', () => {
    test('loadReferenceType', () => {
      action = loadReferenceType();

      expect(action).toEqual({
        type: '[Detail] Load Reference Type',
      });
    });

    test('loadReferenceTypeSuccess', () => {
      const referenceType = REFERENCE_TYPE_MOCK;

      action = loadReferenceTypeSuccess({ referenceType });

      expect(action).toEqual({
        referenceType,
        type: '[Detail] Load Reference Type Success',
      });
    });

    test('loadReferenceTypeFailure', () => {
      action = loadReferenceTypeFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
        type: '[Detail] Load Reference Type Failure',
      });
    });
  });
});
