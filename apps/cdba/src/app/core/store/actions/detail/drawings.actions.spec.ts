import { HttpStatusCode } from '@angular/common/http';

import { DRAWINGS_MOCK } from '@cdba/testing/mocks';

import {
  DrawingsActions,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  selectDrawing,
} from './drawings.actions';
describe('Drawings Actions', () => {
  let action: DrawingsActions;
  const errorMessage = 'An error occured';
  const statusCode = HttpStatusCode.BadRequest;

  beforeEach(() => {
    action = undefined;
  });
  describe('loadDrawings Actions', () => {
    test('loadDrawings', () => {
      action = loadDrawings();

      expect(action).toEqual({
        type: '[Detail] Load Drawings',
      });
    });

    test('loadDrawingsSuccess', () => {
      const items: any[] = [];
      action = loadDrawingsSuccess({ items });

      expect(action).toEqual({
        items,
        type: '[Detail] Load Drawings Success',
      });
    });

    test('loadDrawingsFailure', () => {
      action = loadDrawingsFailure({ errorMessage, statusCode });

      expect(action).toEqual({
        errorMessage,
        statusCode,
        type: '[Detail] Load Drawings Failure',
      });
    });
  });

  test('selectDrawing', () => {
    const nodeId = '1';
    const drawing = DRAWINGS_MOCK[0];
    action = selectDrawing({ nodeId, drawing });

    expect(action).toEqual({
      nodeId,
      drawing,
      type: '[Detail] Select Drawing',
    });
  });
});
