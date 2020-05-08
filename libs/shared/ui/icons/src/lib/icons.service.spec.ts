import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  let service: IconsService;
  let matIconRegistry: MatIconRegistry;

  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    matIconRegistry = TestBed.inject(MatIconRegistry);
    service = TestBed.inject(IconsService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerFontClassAlias', () => {
    test('should register fontClassAlias', () => {
      matIconRegistry.registerFontClassAlias = jest.fn();
      service.registerFontClassAlias();
      expect(matIconRegistry.registerFontClassAlias).toHaveBeenCalledTimes(1);
      expect(matIconRegistry.registerFontClassAlias).toHaveBeenCalledWith(
        'schaeffler-icons',
        'icon'
      );
    });
  });
});
