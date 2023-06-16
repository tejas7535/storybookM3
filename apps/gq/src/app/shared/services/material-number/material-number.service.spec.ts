import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { MaterialNumberService } from './material-number.service';

describe('MaterialNumberService', () => {
  let service: MaterialNumberService;
  let spectator: SpectatorService<MaterialNumberService>;

  const createService = createServiceFactory({
    service: MaterialNumberService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isValidMaterialNumber', () => {
    test('should return true for a 15-digit material number', () => {
      const materialNumber = '000178349-0062-10';
      const isValid = service.isValidMaterialNumber(materialNumber);

      expect(isValid).toEqual(true);
    });
    test('should return true for a 13-digit material number', () => {
      const materialNumber = '000178349-0062';
      const isValid = service.isValidMaterialNumber(materialNumber);

      expect(isValid).toEqual(true);
    });
    test('should return false for any other string', () => {
      const materialNumber = 'materialdescription';
      const isValid = service.isValidMaterialNumber(materialNumber);

      expect(isValid).toEqual(false);
    });
  });

  describe('formatStringAsMaterialNumber', () => {
    let input: string;
    let result: string;
    beforeEach(() => {
      input = undefined;
      result = undefined;
    });

    it('should add a dash in a 13 digit material number', () => {
      input = '1111111112222';

      result = service.formatStringAsMaterialNumber(input);

      expect(result).toEqual('111111111-2222');
    });

    it('should add two dashed in a 15 digit material number', () => {
      input = '111111111222233';

      result = service.formatStringAsMaterialNumber(input);

      expect(result).toEqual('111111111-2222-33');
    });

    it('should not transform the input, if it is no 13/15 digits long', () => {
      input = '112233';

      result = service.formatStringAsMaterialNumber(input);

      expect(result).toEqual('112233');
    });

    it('should return Keyboard.DASH for undefined input', () => {
      result = service.formatStringAsMaterialNumber(
        undefined as unknown as string
      );

      expect(result).toEqual('-');
    });
  });

  describe('matNumberStartsWithSearchString', () => {
    test('should return true, when no-dashed and searchString match the startsWith comparison', () => {
      const result = service.matNumberStartsWithSearchString(
        '0000190000000',
        '0000190-0000-00'
      );
      expect(result).toBe(true);
    });
    test('should return true, when both string have no dashes', () => {
      const result = service.matNumberStartsWithSearchString(
        '0000190000000',
        '0000190000000'
      );
      expect(result).toBe(true);
    });
    test('should return true, when matNumber and searchVal start with same string', () => {
      const result = service.matNumberStartsWithSearchString(
        '0000190000000',
        '0-0-0-0-1-9-0-0-0-0-0-0-0'
      );
      expect(result).toBe(true);
    });
    test('should return false, when matNumber does not match the searchString', () => {
      const result = service.matNumberStartsWithSearchString(
        '0000190000000',
        '1'
      );
      expect(result).toBe(false);
    });
    test('should return falsy value, when matNumber is not set', () => {
      const result = service.matNumberStartsWithSearchString(undefined, '1');
      expect(result).toBeFalsy();
    });
  });
});
