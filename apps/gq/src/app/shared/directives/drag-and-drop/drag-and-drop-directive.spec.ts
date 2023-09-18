import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { DragAndDropDirective } from './drag-and-drop-directive';

describe('Directive: DragAndDrop', () => {
  let spectator: SpectatorDirective<DragAndDropDirective>;
  let directive: DragAndDropDirective;
  const createDirective = createDirectiveFactory({
    directive: DragAndDropDirective,
  });

  beforeEach(() => {
    spectator = createDirective('<div dragAndDrop></div>');
    directive = spectator.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add a class on dragover event', () => {
    const divElement = spectator.element;

    const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault');
    const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation');
    const renderer = jest.spyOn(directive['renderer'], 'addClass');

    const dragOverEvent = new Event('dragover');
    divElement.dispatchEvent(dragOverEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(renderer).toHaveBeenCalledWith(divElement, 'border-primary');
  });

  it('should remove the class on dragleave event', () => {
    const divElement = spectator.element;
    const dragLeaveEvent = new Event('dragleave');
    divElement.classList.add('border-primary');
    jest.spyOn(directive['renderer'], 'removeClass');
    jest.spyOn(dragLeaveEvent, 'preventDefault');
    jest.spyOn(dragLeaveEvent, 'stopPropagation');

    divElement.dispatchEvent(dragLeaveEvent);

    expect(dragLeaveEvent.preventDefault).toHaveBeenCalled();
    expect(dragLeaveEvent.stopPropagation).toHaveBeenCalled();
    expect(directive['renderer'].removeClass).toHaveBeenCalledWith(
      divElement,
      'border-primary'
    );
  });

  it('should emit filesDropped event on drop', () => {
    const divElement = spectator.element;
    const file = new File([], 'test.txt');

    const dropEvent = new Event('drop', {
      bubbles: true,
      cancelable: true,
    });

    const dataTransfer = {
      files: [file],
    };

    // Attach the custom dataTransfer object to the event
    (dropEvent as any).dataTransfer = dataTransfer;

    jest.spyOn(dropEvent, 'preventDefault');
    jest.spyOn(dropEvent, 'stopPropagation');
    const emitSpy = jest.spyOn(directive.filesDropped, 'emit');

    divElement.dispatchEvent(dropEvent);

    expect(dropEvent.preventDefault).toHaveBeenCalled();
    expect(dropEvent.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith([file]);
  });
});
