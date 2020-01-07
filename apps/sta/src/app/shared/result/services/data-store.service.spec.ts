import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataStoreService } from './data-store.service';
import { DataService } from './data.service';

import { Language } from '../models';

describe('DataStoreService', () => {
  let injector: TestBed;
  let service: DataStoreService;
  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataStoreService, DataService]
    });
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.get(DataStoreService);
    dataService = injector.get(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Getter/Setter', () => {
    test('tags should set/get value', () => {
      const test = ['test'];
      service['tags'] = test;
      expect(service['tags']).toEqual(test);
    });
  });

  describe('getTagsForText', () => {
    test('should call postTaggingText and set tags', async () => {
      const test = ['awesome', 'someawe'];
      const testText = '123';
      dataService.postTaggingText = jest
        .fn()
        .mockImplementation(() => Promise.resolve(test));

      await service.getTagsForText(testText);

      expect(dataService.postTaggingText).toHaveBeenCalledWith(testText);
      expect(service['tags']).toEqual(test);
    });
  });

  describe('getTagsForFile', () => {
    test('should call postTaggingFile and set tags', async () => {
      const test = ['awesome', 'someawe'];
      const testFile = new File([], 'test');
      dataService.postTaggingFile = jest
        .fn()
        .mockImplementation(() => Promise.resolve(test));

      await service.getTagsForFile(testFile);

      expect(dataService.postTaggingFile).toHaveBeenCalledWith(testFile);
      expect(service['tags']).toEqual(test);
    });
  });

  describe('getTranslationForText', () => {
    test('should call postTaggingText and set translation', async () => {
      const test = ['awesome', 'someawe'];
      const testText = '123';
      dataService.postTranslationText = jest
        .fn()
        .mockImplementation(() => Promise.resolve(test));

      await service.getTranslationForText(testText);

      expect(dataService.postTranslationText).toHaveBeenCalledWith(
        testText,
        Language.DE
      );
      expect(service['translation']).toEqual(test);
    });
  });

  describe('getTranslationForFile', () => {
    test('should call postTranslationFile and set translation', async () => {
      const test = ['awesome', 'someawe'];
      const testFile = new File([], 'test');
      dataService.postTranslationFile = jest
        .fn()
        .mockImplementation(() => Promise.resolve(test));

      await service.getTranslationForFile(testFile);

      expect(dataService.postTranslationFile).toHaveBeenCalledWith(
        testFile,
        Language.DE
      );
      expect(service['translation']).toEqual(test);
    });
  });

  describe('isDataAvailable', () => {
    test('should return true when tags are there', done => {
      service['tags'] = ['tags'];
      service.isDataAvailable().subscribe(isDataAvl => {
        expect(isDataAvl).toBeTruthy();
        done();
      });
    });

    test('should return false when no tags avl', done => {
      service.isDataAvailable().subscribe(isDataAvl => {
        expect(isDataAvl).toBeFalsy();
        done();
      });
    });
  });
});
