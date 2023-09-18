import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dragAndDrop]',
})
export class DragAndDropDirective {
  @Output() filesDropped = new EventEmitter<FileList>();

  private readonly classesToAdd: string[] = [
    'bg-primary/[.05]',
    'border-primary',
    'border-dashed',
    'border-2',
  ];
  private readonly classesToRemove: string[] = [
    'bg-primary/[.05]',
    'border-primary',
  ];

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.addClasses(this.classesToAdd);
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.removeClasses(this.classesToRemove);
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.removeClasses(this.classesToRemove);

    if (event.dataTransfer && event.dataTransfer.files) {
      const files = event.dataTransfer.files;
      this.filesDropped.emit(files);
    }
  }

  private addClasses(classes: string[]) {
    classes.forEach((className) => {
      this.renderer.addClass(this.el.nativeElement, className);
    });
  }

  private removeClasses(classes: string[]) {
    classes.forEach((className) => {
      this.renderer.removeClass(this.el.nativeElement, className);
    });
  }
}
