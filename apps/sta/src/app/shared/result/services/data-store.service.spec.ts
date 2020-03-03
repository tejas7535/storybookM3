import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DataStoreService } from './data-store.service';
import { DataService } from './data.service';

import { FileStatus } from '../../file-upload/file-status.model';

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
    service = injector.inject(DataStoreService);
    dataService = injector.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Getter/Setter', () => {
    test('tags should set/get value', () => {
      const test = ['test'];
      service['tags'] = test;
      expect(service['_tags'].getValue()).toEqual(test);
    });
  });

  describe('getTagsForText', () => {
    test('should call postTaggingText and set tags', async () => {
      const test = ['awesome', 'someawe'];
      const testText = '123';
      dataService.postTaggingText = jest.fn().mockResolvedValue(test);

      await service.getTagsForText(testText);

      expect(dataService.postTaggingText).toHaveBeenCalledWith(testText);
      expect(service['_tags'].getValue()).toEqual(test);
    });

    test('should update loadingTags', async () => {
      const test = ['awesome', 'someawe'];
      const testText = '123';

      dataService.postTaggingText = jest.fn().mockResolvedValue(test);
      service['_loadingTags'].next = jest.fn();

      await service.getTagsForText(testText);

      expect(service['_loadingTags'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(false);
    });

    test('should update loadingTags on exception', async () => {
      const testText = '123';

      dataService.postTaggingText = jest.fn().mockRejectedValue(undefined);
      service['_loadingTags'].next = jest.fn();

      await service.getTagsForText(testText);

      expect(service['_loadingTags'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(false);
    });
  });

  describe('getTagsForFile', () => {
    test('should call postTaggingFile and set tags', async () => {
      const test = ['awesome', 'someawe'];
      const testFile = new File([], 'test');
      dataService.postTaggingFile = jest.fn().mockResolvedValue(test);

      await service.getTagsForFile(testFile);

      expect(dataService.postTaggingFile).toHaveBeenCalledWith(testFile);
      expect(service['_tags'].getValue()).toEqual(test);
    });

    test('should update loadingTags', async () => {
      const test = ['awesome', 'someawe'];
      const testFile = new File([], 'test');

      dataService.postTaggingFile = jest.fn().mockResolvedValue(test);
      service['_loadingTags'].next = jest.fn();

      await service.getTagsForFile(testFile);

      expect(service['_loadingTags'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(false);
    });

    test('should update loadingTags on exception', async () => {
      const testFile = new File([], 'test');

      dataService.postTaggingFile = jest.fn().mockRejectedValue(undefined);
      service['_loadingTags'].next = jest.fn();

      await service.getTagsForFile(testFile);

      expect(service['_loadingTags'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTags'].next).toHaveBeenCalledWith(false);
    });

    test('should return fileStatus even on failed service call', async () => {
      const testFile = new File([], 'test');
      dataService.postTaggingFile = jest.fn().mockRejectedValue(undefined);

      const result = await service.getTagsForFile(testFile);

      expect(dataService.postTaggingFile).toHaveBeenCalledWith(testFile);
      expect(service['tags']).toEqual(undefined);
      expect(result).toEqual(new FileStatus('test', '', false));
    });

    test('should return fileStatus even on failed service call', async () => {
      const testFile = new File([], 'test');
      dataService.postTaggingFile = jest.fn().mockRejectedValue(undefined);

      const result = await service.getTagsForFile(testFile);

      expect(dataService.postTaggingFile).toHaveBeenCalledWith(testFile);
      expect(service['tags']).toEqual(undefined);
      expect(result).toEqual(new FileStatus('test', '', false));
    });
  });

  describe('getTranslationForText', () => {
    test('should call postTaggingText and set translation', async () => {
      const test = ['awesome', 'someawe'];
      const testText = '123';
      dataService.postTranslationText = jest.fn().mockResolvedValue(test);

      await service.getTranslationForText(testText);

      expect(dataService.postTranslationText).toHaveBeenCalledWith(
        testText,
        Language.DE
      );
      expect(service['_translation'].getValue()).toEqual(test);
    });

    test('should update loadingTranslation', async () => {
      const test = ['awesome', 'someawe'];
      const testText = '123';

      dataService.postTranslationText = jest.fn().mockResolvedValue(test);
      service['_loadingTranslation'].next = jest.fn();

      await service.getTranslationForText(testText);

      expect(service['_loadingTranslation'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(false);
    });

    test('should update loadingTranslation on exception', async () => {
      const testText = '123';

      dataService.postTranslationText = jest.fn().mockRejectedValue(undefined);
      service['_loadingTranslation'].next = jest.fn();

      await service.getTranslationForText(testText);

      expect(service['_loadingTranslation'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(false);
    });
  });

  describe('getTranslationForFile', () => {
    test('should call postTranslationFile and set translation', async () => {
      const test = 'test';
      const testFile = new File([], 'test');
      service.reset = jest.fn();
      dataService.postTranslationFile = jest.fn().mockResolvedValue(test);

      const result = await service.getTranslationForFile(testFile);

      expect(dataService.postTranslationFile).toHaveBeenCalledWith(
        testFile,
        Language.DE
      );
      expect(service['_translation'].getValue()).toEqual(test);
      expect(service.reset).toHaveBeenCalled();
      expect(result).toEqual(new FileStatus('test', '', true));
    });

    test('should update loadingTranslation', async () => {
      const test = 'test';
      const testFile = new File([], 'test');

      service.reset = jest.fn();
      dataService.postTranslationFile = jest.fn().mockResolvedValue(test);
      service['_loadingTranslation'].next = jest.fn();

      await service.getTranslationForFile(testFile);

      expect(service['_loadingTranslation'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(false);
    });

    test('should update loadingTranslation', async () => {
      const testFile = new File([], 'test');

      service.reset = jest.fn();
      dataService.postTranslationFile = jest.fn().mockRejectedValue(undefined);
      service['_loadingTranslation'].next = jest.fn();

      await service.getTranslationForFile(testFile);

      expect(service['_loadingTranslation'].next).toHaveBeenCalledTimes(2);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(true);
      expect(service['_loadingTranslation'].next).toHaveBeenCalledWith(false);
    });

    test('should return fileStatus even on failed service call', async () => {
      const testFile = new File([], 'test');
      dataService.postTranslationFile = jest.fn().mockRejectedValue(undefined);

      const result = await service.getTranslationForFile(testFile);

      expect(dataService.postTranslationFile).toHaveBeenCalledWith(
        testFile,
        Language.DE
      );
      expect(service['translation']).toEqual(undefined);
      expect(result).toEqual(new FileStatus('test', '', false));
    });
  });

  describe('reset', () => {
    test('should set variables to their initial states and reset', () => {
      service['tags'] = ['tag1', 'tag2'];
      service['translation'] = 'awesome translation';
      service['_reset'].next = jest.fn();

      service.reset();

      expect(service['tags']).toBeUndefined();
      expect(service['translation']).toBeUndefined();
      expect(service['_reset'].next).toHaveBeenCalledTimes(1);
    });
  });
});
