import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { FileDropDirective } from './file-drop.directive';

describe('FileDropDirective', () => {
  let spectator: SpectatorDirective<FileDropDirective>;
  let directive: FileDropDirective;

  const createDirective = createDirectiveFactory({
    directive: FileDropDirective,
  });

  const event = {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;

  beforeEach(() => {
    spectator = createDirective(`<div schaefflerFileDrop></div>`);
    directive = spectator.directive;
  });

  test('should create', () => {
    expect(directive).toBeTruthy();
  });

  test('should set default border color on init', () => {
    directive['borderColor'] = undefined as any;

    directive.ngOnInit();

    expect(directive['borderColor']).toBe(directive['DEFAULT_BORDER_COLOR']);
  });

  describe('handleDragOver', () => {
    test('should change border color', () => {
      directive['borderColor'] = undefined as any;

      directive.handleDragOver(event);

      expect(directive['borderColor']).toBe(
        directive['DRAG_OVER_BORDER_COLOR']
      );
    });

    test('should not change border color', () => {
      directive['borderColor'] = undefined as any;
      directive.dragAndDropDisabled = true;

      directive.handleDragOver(event);

      expect(directive['borderColor']).toBeUndefined();
    });
  });

  describe('handleDragLeave', () => {
    test('should change border color', () => {
      directive['borderColor'] = undefined as any;

      directive.handleDragLeave(event);

      expect(directive['borderColor']).toBe(directive['DEFAULT_BORDER_COLOR']);
    });

    test('should not change border color', () => {
      directive['borderColor'] = undefined as any;
      directive.dragAndDropDisabled = true;

      directive.handleDragLeave(event);

      expect(directive['borderColor']).toBeUndefined();
    });
  });

  describe('handleDrop', () => {
    test('should change border color and emit dropped file', () => {
      const file = new File([''], 'test.xlsx');

      directive.filesDropped.emit = jest.fn();
      directive['borderColor'] = undefined as any;

      directive.handleDrop({
        ...event,
        dataTransfer: {
          files: [file],
        },
      });

      expect(directive['borderColor']).toBe(directive['DEFAULT_BORDER_COLOR']);
      expect(directive.filesDropped.emit).toHaveBeenCalledWith([file]);
    });

    test('should not change border color and not emit dropped file', () => {
      const file = new File([''], 'test.xlsx');

      directive.filesDropped.emit = jest.fn();
      directive['borderColor'] = undefined as any;
      directive.dragAndDropDisabled = true;

      directive.handleDrop({
        ...event,
        dataTransfer: {
          files: [file],
        },
      });

      expect(directive['borderColor']).toBeUndefined();
      expect(directive.filesDropped.emit).not.toHaveBeenCalled();
    });
  });
});
