import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[schaefflerDroppable]',
})
export class DroppableDirective {
  @Input() public accept: string[];
  @Output() public readonly dropped: EventEmitter<any> = new EventEmitter();

  /**
   * Function to listen on drop event
   */
  @HostListener('drop', ['$event']) public drop(event: any): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const name = event.dataTransfer.files[0].name;

      if (this.checkFileTypeAcceptance(name)) {
        this.dropped.emit(event);
      }
    }
  }

  /**
   * Check file type whether it's allowed to drop
   */
  private checkFileTypeAcceptance(name: string): boolean {
    if (!name) {
      return false;
    }

    if (!this.accept) {
      return true;
    }
    const splitted = name.split('.');
    const type = `.${splitted[splitted.length - 1]}`;

    return this.accept.indexOf(type) !== -1;
  }
}
