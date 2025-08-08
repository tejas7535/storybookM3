import { DragDrop } from '@angular/cdk/drag-drop';
import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dragDialog]',
})
export class DragDialogDirective implements OnInit {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly dragDrop = inject(DragDrop);
  private readonly renderer = inject(Renderer2);

  ngOnInit(): void {
    const latestPane: ElementRef<HTMLElement> =
      this.element.nativeElement.closest('.cdk-overlay-pane');
    const dragRef = this.dragDrop.createDrag(this.element);
    if (!dragRef) {
      return;
    }
    dragRef.withRootElement(latestPane);
    dragRef.withHandles([this.element]);
    this.renderer.setStyle(this.element.nativeElement, 'cursor', 'move');
  }
}
