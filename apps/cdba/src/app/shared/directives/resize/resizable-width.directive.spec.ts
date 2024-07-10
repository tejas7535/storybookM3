import { ElementRef } from '@angular/core';

import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { ResizableWidthDirective } from './resizable-width.directive';

class MockElementRef extends ElementRef {
  nativeElement = {};
  constructor() {
    super(undefined);
  }
}
describe('ResizableWidthDirective', () => {
  let spectator: SpectatorDirective<ResizableWidthDirective>;
  let directive: ResizableWidthDirective;

  const createDirective = createDirectiveFactory({
    directive: ResizableWidthDirective,
    providers: [{ provide: ElementRef, useClass: MockElementRef }],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div><div cdbaResizableWidth>I am resizable!</div></div>`
    );

    directive = spectator.directive;
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should configure directive when component is resizable', () => {
      const setStyleSpy = jest.spyOn(directive['renderer'], 'setStyle');
      const addResizeHolderSpy = jest.spyOn(
        directive as any,
        'addResizeHolder'
      );

      directive.resizable = true;

      directive.ngOnInit();

      expect(setStyleSpy).toHaveBeenNthCalledWith(
        1,
        directive['resizableElement'],
        'min-width',
        directive.resizableMinWidth
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        2,
        directive['resizableElement'],
        'max-width',
        directive.resizableMaxWidth
      );
      expect(addResizeHolderSpy).toHaveBeenCalled();
    });

    it('should not configure directive when component is not resizable', () => {
      const setStyleSpy = jest.spyOn(directive['renderer'], 'setStyle');
      const addResizeHolderSpy = jest.spyOn(
        directive as any,
        'addResizeHolder'
      );

      directive.resizable = false;

      directive.ngOnInit();

      expect(setStyleSpy).not.toHaveBeenCalled();
      expect(addResizeHolderSpy).not.toHaveBeenCalled();
    });
  });

  describe('onMouseDown', () => {
    it('should set pressed to true and initialize startX and startWidth', () => {
      const event = new MouseEvent('mousedown');
      (event as any).pageX = 100;

      directive.onMouseDown(event);

      expect(directive['pressed']).toBe(true);
      expect(directive['startX']).toBe(100);
      expect(directive['startWidth']).toBe(
        directive['resizableElement'].offsetWidth
      );
    });
  });

  describe('onMouseMove', () => {
    it('should emit widthResizeStart and update width when pressed is true', () => {
      const event = { type: 'mousemove', pageX: 150, buttons: 1 } as MouseEvent;
      directive['pressed'] = true;
      directive['startX'] = 100;
      directive['startWidth'] = 200;

      const emitSpy = jest.spyOn(directive['widthResizeStart'], 'emit');
      const addClassSpy = jest.spyOn(directive['renderer'], 'addClass');
      const setStyleSpy = jest.spyOn(directive['renderer'], 'setStyle');

      directive.onMouseMove(event);

      expect(emitSpy).toHaveBeenCalled();
      expect(addClassSpy).toHaveBeenCalledWith(document.body, 'select-none');
      expect(setStyleSpy).toHaveBeenCalledWith(
        directive['resizableElement'],
        'width',
        '250px'
      );
    });

    it('should not emit widthResizeStart and update width when pressed is false', () => {
      const event = new MouseEvent('mousemove');
      (event as any).pageX = 150;
      directive['pressed'] = false;
      directive['startX'] = 100;
      directive['startWidth'] = 200;

      const emitSpy = jest.spyOn(directive['widthResizeStart'], 'emit');
      const addClassSpy = jest.spyOn(directive['renderer'], 'addClass');
      const setStyleSpy = jest.spyOn(directive['renderer'], 'setStyle');

      directive.onMouseMove(event);

      expect(emitSpy).not.toHaveBeenCalled();
      expect(addClassSpy).not.toHaveBeenCalled();
      expect(setStyleSpy).not.toHaveBeenCalled();
    });
  });

  describe('onMouseUp', () => {
    it('should set pressed to false and emit widthResizeEnd', () => {
      directive['pressed'] = true;

      const emitSpy = jest.spyOn(directive['widthResizeEnd'], 'emit');
      const removeClassSpy = jest.spyOn(directive['renderer'], 'removeClass');

      directive.onMouseUp();

      expect(directive['pressed']).toBe(false);
      expect(emitSpy).toHaveBeenCalled();
      expect(removeClassSpy).toHaveBeenCalledWith(document.body, 'select-none');
    });

    it('should not emit widthResizeEnd when pressed is false', () => {
      directive['pressed'] = false;

      const emitSpy = jest.spyOn(directive['widthResizeEnd'], 'emit');
      const removeClassSpy = jest.spyOn(directive['renderer'], 'removeClass');

      directive.onMouseUp();

      expect(emitSpy).not.toHaveBeenCalled();
      expect(removeClassSpy).not.toHaveBeenCalled();
    });
  });

  describe('addResizeHolder', () => {
    it('should add resize holder element and listen for mousedown event', () => {
      const createElementSpy = jest.spyOn(
        directive['renderer'],
        'createElement'
      );
      const setStyleSpy = jest.spyOn(directive['renderer'], 'setStyle');
      const appendChildSpy = jest.spyOn(directive['renderer'], 'appendChild');
      const listenSpy = jest.spyOn(directive['renderer'], 'listen');

      directive['addResizeHolder']();

      expect(createElementSpy).toHaveBeenCalledWith('span');

      expect(setStyleSpy).toHaveBeenNthCalledWith(
        1,
        expect.any(HTMLElement),
        'background-image',
        "url('./assets/images/resizable_handle_vertical.png')"
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        2,
        expect.any(HTMLElement),
        'background-size',
        '16px'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        3,
        expect.any(HTMLElement),
        'background-position',
        'center'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        4,
        expect.any(HTMLElement),
        'background-repeat',
        'no-repeat'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        5,
        expect.any(HTMLElement),
        'cursor',
        'col-resize'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        6,
        expect.any(HTMLElement),
        'position',
        'absolute'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        7,
        expect.any(HTMLElement),
        'top',
        '0'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        8,
        expect.any(HTMLElement),
        expect.any(String),
        '-10px'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        9,
        expect.any(HTMLElement),
        'width',
        '20px'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        10,
        expect.any(HTMLElement),
        'height',
        '100%'
      );
      expect(setStyleSpy).toHaveBeenNthCalledWith(
        11,
        expect.any(HTMLElement),
        'z-index',
        '1'
      );
      expect(appendChildSpy).toHaveBeenCalledWith(
        directive['resizableElement'],
        expect.any(HTMLElement)
      );
      expect(listenSpy).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        'mousedown',
        expect.any(Function)
      );
    });
  });
});
