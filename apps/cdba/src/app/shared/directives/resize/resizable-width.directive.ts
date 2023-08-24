import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[cdbaResizableWidth]',
})
export class ResizableWidthDirective implements OnInit {
  @Input('cdbaResizableWidth') public resizable: boolean;
  @Input() public resizableDisplay: 'block' | 'flex' = 'block';
  @Input() public resizableAlignment: 'left' | 'right' = 'left';
  @Input() public resizableMinWidth = '500px';
  @Input() public resizableMaxWidth = '80%';

  @Output()
  private readonly widthResizeStart: EventEmitter<void> = new EventEmitter();
  @Output()
  private readonly widthResizeEnd: EventEmitter<void> = new EventEmitter();

  private readonly resizableElement: HTMLElement;
  private resizableElementParent: HTMLElement;

  private startX: number;
  private startWidth: number;

  private pressed: boolean;

  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef
  ) {
    this.resizableElement = this.elementRef.nativeElement;
  }

  public ngOnInit() {
    if (this.resizable) {
      this.resizableElementParent = this.renderer.parentNode(
        this.resizableElement
      );

      this.renderer.setStyle(
        this.resizableElement,
        'min-width',
        this.resizableMinWidth
      );
      this.renderer.setStyle(
        this.resizableElement,
        'max-width',
        this.resizableMaxWidth
      );
      this.addResizeHolder();

      this.renderer.listen(
        this.resizableElementParent,
        'mousemove',
        this.onMouseMove
      );

      this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.resizableElement.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    if (this.pressed && event.buttons) {
      this.widthResizeStart.emit();
      this.renderer.addClass(document.body, 'select-none');

      // calculate new width
      // depending on alignment and mouse movement direction
      const delta = event.pageX - this.startX;
      const width =
        this.resizableAlignment === 'left'
          ? this.startWidth + delta
          : this.startWidth - delta;

      // set new width
      // depending on display style
      this.renderer.setStyle(
        this.resizableElement,
        this.resizableDisplay === 'block' ? 'width' : 'flex-basis',
        `${width}px`
      );
    }
  };

  onMouseUp = () => {
    if (this.pressed) {
      this.pressed = false;

      this.widthResizeEnd.emit();
      this.renderer.removeClass(document.body, 'select-none');
    }
  };

  private addResizeHolder(): void {
    const resizeHolder = this.renderer.createElement('span');
    this.renderer.setStyle(
      resizeHolder,
      'background-image',
      "url('./assets/images/resizable_handle_vertical.png')"
    );
    this.renderer.setStyle(resizeHolder, 'background-size', '16px');
    this.renderer.setStyle(resizeHolder, 'background-position', 'center');
    this.renderer.setStyle(resizeHolder, 'background-repeat', 'no-repeat');
    this.renderer.setStyle(resizeHolder, 'cursor', 'col-resize');
    this.renderer.setStyle(resizeHolder, 'position', 'absolute');
    this.renderer.setStyle(resizeHolder, 'top', '0');
    this.renderer.setStyle(
      resizeHolder,
      this.resizableAlignment === 'left' ? 'right' : 'left',
      '-10px'
    );
    this.renderer.setStyle(resizeHolder, 'width', '20px');
    this.renderer.setStyle(resizeHolder, 'height', '100%');
    this.renderer.setStyle(resizeHolder, 'z-index', '1');

    this.renderer.appendChild(this.resizableElement, resizeHolder);
    this.renderer.listen(resizeHolder, 'mousedown', this.onMouseDown);
  }
}
