import { RecommendationFormValue } from '@lsa/shared/models';
import {
  mockApplicationInput,
  mockLubricantInput,
  mockLubricationPointsInput,
} from '@lsa/testing/mocks/input.mock';

import { objectCompare, transformFormValue } from './form-helper';

describe('formHelper', () => {
  it('should transform the form value into a recommendationRequest', () => {
    const mockFormValue: RecommendationFormValue = {
      lubricationPoints: mockLubricationPointsInput,
      lubricant: mockLubricantInput,
      application: mockApplicationInput,
    };
    const result = transformFormValue(mockFormValue);

    expect(result).toMatchSnapshot();
  });

  describe('objectCompare', () => {
    describe('should match', () => {
      it('two simple objects', () => {
        const simpleObject = {
          test: 'ABCD',
        };
        const r = objectCompare(simpleObject, { ...simpleObject });
        expect(r).toEqual(true);
      });

      it('two nested objects', () => {
        const simpleObject = {
          test: {
            nested: true,
          },
        };

        const compareAginst = {
          test: {
            nested: true,
          },
        };
        const r = objectCompare(simpleObject, compareAginst);
        expect(r).toEqual(true);
      });

      it('two objects with arrays', () => {
        const simpleObject = {
          test: {
            nested: [1, 2],
          },
          nested: [2, 3],
        };

        const compareAginst = {
          test: {
            nested: [1, 2],
          },
          nested: [2, 3],
        };
        const r = objectCompare(simpleObject, compareAginst);
        expect(r).toEqual(true);
      });
    });

    describe('should not match', () => {
      it("objects that don't have the same shape", () => {
        const simpleObject = {
          test: {
            nested: [1, 2],
          },
          nested: [2, 3],
        };

        const compareAginst = {
          test: {
            nested: [1, 2],
          },
        };
        const r = objectCompare(simpleObject, compareAginst);
        expect(r).toEqual(false);
      });

      it("objects that don't have matching arrays", () => {
        const simpleObject = {
          nested: [2, 3],
        };

        const compareAginst = {
          nested: [1, 2],
        };
        const r = objectCompare(simpleObject, compareAginst);
        expect(r).toEqual(false);
      });

      it("objects that don't have matching properties", () => {
        const simpleObject = {
          test: 'I am the first simple object',
        };

        const compareAginst = {
          test: 'I am the second simple object',
        };
        const r = objectCompare(simpleObject, compareAginst);
        expect(r).toEqual(false);
      });
    });
  });
});
