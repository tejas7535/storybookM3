import { DragDrop } from '@angular/cdk/drag-drop';
import { Renderer2 } from '@angular/core';

import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';
import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

describe('Directive: DragDialog', () => {
  let spectator: SpectatorDirective<DragDialogDirective>;
  let directive: DragDialogDirective;

  const dragRef = {
    withRootElement: jest.fn(),
    withHandles: jest.fn(),
  };

  const createDirective = createDirectiveFactory({
    directive: DragDialogDirective,
    providers: [
      {
        provide: DragDrop,
        useValue: {
          createDrag: jest.fn(() => dragRef),
        },
      },
      {
        provide: Renderer2,
        useValue: {
          setStyle: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createDirective('<div dragDialog></div>');
    directive = spectator.directive;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  test('should create draggable element', () => {
    jest.spyOn(directive['dragDrop'], 'createDrag');
    jest.spyOn(directive['renderer'], 'setStyle');

    // Mock the dialog container element
    const mockDialogContainer = document.createElement('div');
    mockDialogContainer.classList.add('cdk-overlay-pane');

    // Mock the closest method to return the dialog container
    jest
      .spyOn(spectator.element, 'closest')
      .mockReturnValue(mockDialogContainer);

    directive.ngOnInit();

    expect(spectator.element.closest).toHaveBeenCalledWith('.cdk-overlay-pane');
    expect(directive['dragDrop'].createDrag).toHaveBeenCalled();
    expect(directive['renderer'].setStyle).toHaveBeenCalled();
  });

  test('should handle case when dragRef is not created', () => {
    jest.spyOn(directive['dragDrop'], 'createDrag').mockReturnValue(null);
    jest.spyOn(directive['renderer'], 'setStyle');

    // Mock the dialog container element
    const mockDialogContainer = document.createElement('div');
    mockDialogContainer.classList.add('cdk-overlay-pane');

    // Mock the closest method to return the dialog container
    jest
      .spyOn(spectator.element, 'closest')
      .mockReturnValue(mockDialogContainer);

    directive.ngOnInit();

    expect(spectator.element.closest).toHaveBeenCalledWith('.cdk-overlay-pane');
    expect(directive['dragDrop'].createDrag).toHaveBeenCalled();
    expect(directive['renderer'].setStyle).not.toHaveBeenCalled();
  });
});
