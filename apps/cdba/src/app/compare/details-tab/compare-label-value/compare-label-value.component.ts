import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'cdba-compare-label-value',
  templateUrl: './compare-label-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompareLabelValueComponent implements AfterViewInit {
  @Input() label: string;
  @Input() value: string;
  @Input() borderBottom: boolean;

  private hideTooltip = false;

  @ViewChild('componentWrapper')
  private readonly componentWrapperRef: ElementRef;

  ngAfterViewInit() {
    this.hideTooltip =
      this.componentWrapperRef?.nativeElement?.offsetWidth >=
      this.componentWrapperRef?.nativeElement?.scrollWidth;
  }

  get hideTooltip$(): Observable<boolean> {
    return of(this.hideTooltip);
  }
}
