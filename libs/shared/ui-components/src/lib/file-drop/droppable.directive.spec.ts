import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DroppableDirective } from './droppable.directive';

describe('DroppableDirective', () => {
  let directive: DroppableDirective;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [DroppableDirective]
    });
  });

  beforeEach(() => {
    directive = TestBed.get(DroppableDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('drop', () => {
    let event;

    const defaultEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {}
    };

    beforeEach(() => {
      directive['checkFileTypeAcceptance'] = jest.fn().mockReturnValue(false);
      spyOn(directive.dropped, 'emit');
      event = undefined;
    });

    it('should prevent the default event', () => {
      event = defaultEvent;

      directive.drop(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should emit Event dropped when file is existing and file type is correct', () => {
      event = {
        ...defaultEvent,
        dataTransfer: { files: [{ name: 'test.docx' }] }
      };
      directive['checkFileTypeAcceptance'] = jest.fn().mockReturnValue(true);

      directive.drop(event);

      expect(directive.dropped.emit).toHaveBeenCalledWith(event);
    });

    it('should not emit Event dropped when file is not existing', () => {
      event = {
        ...defaultEvent,
        dataTransfer: { files: [{}] }
      };

      directive.drop(event);

      expect(directive.dropped.emit).not.toHaveBeenCalled();
    });

    it('should not emit Event dropped when the file exists but its the wrong file type', () => {
      event = {
        ...defaultEvent,
        dataTransfer: { files: [{ name: 'test.docx' }] }
      };

      directive.drop(event);

      expect(directive.dropped.emit).not.toHaveBeenCalled();
    });
  });

  describe('checkFileTypeAcceptance', () => {
    let name;
    let accepted;
    let result;

    beforeEach(() => {
      name = undefined;
      accepted = undefined;
      result = undefined;
    });

    it('should return false, when name is undefined', () => {
      result = directive['checkFileTypeAcceptance'](name);

      expect(result).toEqual(false);
    });

    it('should return true, when accept is undefined', () => {
      name = 'test.docx';

      result = directive['checkFileTypeAcceptance'](name);

      expect(result).toEqual(true);
    });

    it('should return false for non accepted file type', () => {
      accepted = ['.docx'];
      directive.accept = accepted;
      name = 'test.doc';

      result = directive['checkFileTypeAcceptance'](name);

      expect(result).toEqual(false);
    });

    it('should return true for accepted file type', () => {
      accepted = ['.docx'];
      directive.accept = accepted;
      name = 'test.docx';

      result = directive['checkFileTypeAcceptance'](name);

      expect(result).toEqual(true);
    });
  });
});
