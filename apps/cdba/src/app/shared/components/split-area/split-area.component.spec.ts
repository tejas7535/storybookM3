import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockModule, MockPipe } from 'ng-mocks';

import { SplitAreaComponent } from './split-area.component';

describe('SplitAreaComponent', () => {
  let component: SplitAreaComponent;
  let spectator: Spectator<SplitAreaComponent>;
  let leftAreaMock: any;

  const createComponent = createComponentFactory({
    component: SplitAreaComponent,
    detectChanges: false,
    imports: [
      MockModule(CommonModule),
      MockPipe(PushPipe),
      MockModule(MatButtonModule),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component['renderer'].setStyle = jest.fn();

    component.wrapper = { nativeElement: { clientWidth: 500 } } as any;
    component.separator = {
      nativeElement: {
        clientWidth: 50,
        getBoundingClientRect: jest.fn(() => ({ x: 1 })),
      },
    } as any;
    leftAreaMock = {
      nativeElement: {
        getBoundingClientRect: jest.fn(() => ({ width: 200, x: 1 })),
      },
    } as any;
    component.leftArea = leftAreaMock;

    component.isLoading$ = { subscribe: jest.fn(() => true) } as any;
    component.isLoadingSubscription = {
      unsubscribe: jest.fn(),
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLoading to false if isLoading$ emits false on ngOnInit', () => {
    const mockSubscribe = jest.fn((cb: (val: boolean) => void) => {
      cb(false);

      return { unsubscribe: jest.fn() };
    });
    component.isLoading$ = { subscribe: mockSubscribe } as any;

    component.ngOnInit();

    expect(component.isLoading).toBe(false);
    expect(mockSubscribe).toHaveBeenCalled();
  });

  it('should assign the subscription to isLoadingSubscription on ngOnInit', () => {
    const fakeSubscription = { unsubscribe: jest.fn() };
    const mockSubscribe = jest.fn(() => fakeSubscription);
    component.isLoading$ = { subscribe: mockSubscribe } as any;

    component.ngOnInit();

    expect(component.isLoadingSubscription).toBe(fakeSubscription);
  });

  it('should initialize defaultLeftAreaWidth and set leftArea width on ngAfterViewInit', () => {
    const rendererSpy = jest.spyOn(component['renderer'], 'setStyle');

    component.ngAfterViewInit();

    expect(component.isDragDisabled).toBe(false);
    expect(component.defaultLeftAreaWidth).toBe(225);
    expect(rendererSpy).toHaveBeenCalledWith(
      leftAreaMock.nativeElement,
      'width',
      '225px'
    );
  });

  it('should not initialize defaultLeftAreaWidth and set leftArea width on ngAfterViewInit when component is loading', () => {
    const rendererSpy = jest.spyOn(component['renderer'], 'setStyle');
    component.isLoading = true;

    component.ngAfterViewInit();

    expect(component.isDragDisabled).toBe(false);
    expect(component.defaultLeftAreaWidth).toBe(undefined);
    expect(rendererSpy).not.toHaveBeenCalled();
  });

  it('should enable dragging on onDragStarted', () => {
    component.onDragStarted();
    expect(component.isDragging).toBe(true);
  });

  it('should disable dragging on onDragEnded', () => {
    component.onDragEnded();
    expect(component.isDragging).toBe(false);
  });

  it('should reset leftArea width on onDragIconDoubleClick', () => {
    component.leftArea = leftAreaMock as any;
    component.defaultLeftAreaWidth = 300;

    const rendererSpy = jest.spyOn(component['renderer'], 'setStyle');

    component.onDragIconDoubleClick();

    expect(rendererSpy).toHaveBeenCalledWith(
      leftAreaMock.nativeElement,
      'width',
      '300px'
    );
  });

  it('should update leftArea width on onDragMoved', () => {
    component.isDragging = true;

    const rendererSpy = jest.spyOn(component['renderer'], 'setStyle');

    component.onDragMoved({ movementX: 50, clientX: 300 } as MouseEvent);

    expect(rendererSpy).toHaveBeenCalledWith(
      leftAreaMock.nativeElement,
      'width',
      '250px'
    );
  });

  it('should not update leftArea width if not dragging', () => {
    component.isDragging = false;

    const rendererSpy = jest.spyOn(component['renderer'], 'setStyle');

    component.onDragMoved({ movementX: 50, clientX: 300 } as MouseEvent);

    expect(rendererSpy).not.toHaveBeenCalled();
  });

  it('should calculate separator middle position', () => {
    const separatorMock = {
      nativeElement: {
        getBoundingClientRect: () => ({ x: 100 }),
        clientWidth: 50,
      },
    };
    component.separator = separatorMock as any;

    component['calculateSeparatorMiddlePosition']();

    expect(component.separatorMiddle).toBe(125);
  });
});
