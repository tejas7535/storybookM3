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
    const panes = [
      document.createElement('div'),
      document.createElement('div'),
    ];
    jest.spyOn(document, 'querySelectorAll').mockReturnValue({
      length: 2,
      item: jest.fn((index) => panes[index]),
    } as any);

    directive.ngOnInit();

    expect(directive['dragDrop'].createDrag).toHaveBeenCalled();
    expect(directive['renderer'].setStyle).toHaveBeenCalled();
  });
});
