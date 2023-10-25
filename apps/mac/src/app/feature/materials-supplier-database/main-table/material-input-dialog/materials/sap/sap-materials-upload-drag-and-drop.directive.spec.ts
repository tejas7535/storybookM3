import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { SapMaterialsUploadDragAndDropDirective } from './sap-materials-upload-drag-and-drop.directive';

describe('SapMaterialsUploadDragAndDropDirective', () => {
  let spectator: SpectatorDirective<SapMaterialsUploadDragAndDropDirective>;
  let directive: SapMaterialsUploadDragAndDropDirective;

  const createDirective = createDirectiveFactory({
    directive: SapMaterialsUploadDragAndDropDirective,
  });

  const event = {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  } as any;

  beforeEach(() => {
    spectator = createDirective(`<div macSapMaterialsUploadDragAndDrop></div>`);
    directive = spectator.directive;
  });

  test('should create', () => {
    expect(directive).toBeTruthy();
  });

  test('should set default border color on init', () => {
    directive.borderColor = undefined;

    directive.ngOnInit();

    expect(directive.borderColor).toBe(directive['DEFAULT_BORDER_COLOR']);
  });

  describe('handleDragOver', () => {
    test('should change border color', () => {
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = true;

      directive.handleDragOver(event);

      expect(directive.borderColor).toBe(directive['DRAG_OVER_BORDER_COLOR']);
    });

    test('should not change border color', () => {
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = false;

      directive.handleDragOver(event);

      expect(directive.borderColor).toBeUndefined();
    });
  });

  describe('handleDragLeave', () => {
    test('should change border color', () => {
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = true;

      directive.handleDragLeave(event);

      expect(directive.borderColor).toBe(directive['DEFAULT_BORDER_COLOR']);
    });

    test('should not change border color', () => {
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = false;

      directive.handleDragLeave(event);

      expect(directive.borderColor).toBeUndefined();
    });
  });

  describe('handleDrop', () => {
    test('should change border color and emit dropped file', () => {
      const file = new File([''], 'test.xlsx');

      directive.fileDropped.emit = jest.fn();
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = true;

      directive.handleDrop({
        ...event,
        dataTransfer: {
          files: [file],
        },
      });

      expect(directive.borderColor).toBe(directive['DEFAULT_BORDER_COLOR']);
      expect(directive.fileDropped.emit).toHaveBeenCalledWith(file);
    });

    test('should change border color but not emit dropped files', () => {
      directive.fileDropped.emit = jest.fn();
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = true;

      directive.handleDrop({
        ...event,
        dataTransfer: {
          files: [new File([''], 'test1.xlsx'), new File([''], 'test2.xlsx')],
        },
      });

      expect(directive.borderColor).toBe(directive['DEFAULT_BORDER_COLOR']);
      expect(directive.fileDropped.emit).not.toHaveBeenCalled();
    });

    test('should not change border color and not emit dropped file', () => {
      const file = new File([''], 'test.xlsx');

      directive.fileDropped.emit = jest.fn();
      directive.borderColor = undefined;
      directive.dragAndDropEnabled = false;

      directive.handleDrop({
        ...event,
        dataTransfer: {
          files: [file],
        },
      });

      expect(directive.borderColor).toBeUndefined();
      expect(directive.fileDropped.emit).not.toHaveBeenCalled();
    });
  });
});
