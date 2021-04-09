import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { DroppableDirective } from './droppable.directive';

describe('DroppableDirective', () => {
  let spectator: SpectatorDirective<DroppableDirective>;
  let directive: DroppableDirective;

  const createDirective = createDirectiveFactory(DroppableDirective);

  beforeEach(() => {
    spectator = createDirective(
      `<div schaefflerDroppable>Testing Drop Directive</div>`
    );
    directive = spectator.directive;
  });

  it('should get the instance', () => {
    expect(directive).toBeDefined();
  });

  describe('drop', () => {
    let event;

    const defaultEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {},
    };
    beforeEach(() => {
      directive['checkFileTypeAcceptance'] = jest.fn().mockReturnValue(false);
      spyOn(directive.dropped, 'emit');
      event = undefined;
    });

    it('should prevent the default event', () => {
      event = defaultEvent;
      spectator.dispatchFakeEvent(spectator.element, 'drop');
      directive.drop(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should emit Event dropped when file is existing and file type is correct', () => {
      event = {
        ...defaultEvent,
        dataTransfer: { files: [{ name: 'test.docx' }] },
      };
      directive['checkFileTypeAcceptance'] = jest.fn().mockReturnValue(true);

      directive.drop(event);

      expect(directive.dropped.emit).toHaveBeenCalledWith(event);
    });

    it('should not emit Event dropped when file is not existing', () => {
      event = {
        ...defaultEvent,
        dataTransfer: { files: [{}] },
      };

      directive.drop(event);

      expect(directive.dropped.emit).not.toHaveBeenCalled();
    });

    it('should not emit Event dropped when the file exists but its the wrong file type', () => {
      event = {
        ...defaultEvent,
        dataTransfer: { files: [{ name: 'test.docx' }] },
      };

      directive.drop(event);

      expect(directive.dropped.emit).not.toHaveBeenCalled();
    });
  });

  describe('checkFileTypeAcceptance', () => {
    let name: string;
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
