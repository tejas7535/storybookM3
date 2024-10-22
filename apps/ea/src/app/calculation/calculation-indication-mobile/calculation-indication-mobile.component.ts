import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'ea-calculation-indication-mobile',
  templateUrl: './calculation-indication-mobile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressBarModule],
})
export class CalculationIndicationMobileComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() isCalculationLoading: boolean;

  @Input() isCalculationResultAvailable: boolean;

  @Input() isVirtualKeyboardVisible: boolean;

  private viewPort: VisualViewport;
  private resizeListener: () => void;
  private keydownListener: () => void;
  private scrollListener: () => void;

  constructor(private readonly renderer: Renderer2) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.updatePosition();
  }

  ngOnInit(): void {
    if (this.checkIfMobileWeb()) {
      this.initializeWebListeners();
    }
  }

  ngOnDestroy(): void {
    if (this.checkIfMobileWeb()) {
      this.clearUpWebListeners();
    }
  }

  updatePositionWithDelay = () => {
    setTimeout(() => {
      this.updatePosition();
    }, 500);
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updatePosition = () => {
    const fixedElement: HTMLElement = document.querySelector(
      '.loading-spinner-wrapper'
    );

    if (!fixedElement) {
      return;
    }

    this.setPosition(fixedElement);
  };

  private checkIfMobileWeb(): boolean {
    return /iphone|android/i.test(navigator.userAgent);
  }

  private isAndroid(): boolean {
    return /android/i.test(navigator.userAgent);
  }

  private setPosition(fixedElement: HTMLElement): void {
    let keyboardHeight = window.innerHeight - this.viewPort.height;

    if (this.isAndroid()) {
      keyboardHeight =
        window.innerHeight - this.viewPort.height - this.viewPort.offsetTop;
    }

    fixedElement.style.bottom = `${keyboardHeight}px`;
  }

  private initializeWebListeners(): void {
    this.viewPort = window.visualViewport;

    this.updatePosition();
    this.resizeListener = this.renderer.listen(
      this.viewPort,
      'resize',
      this.updatePosition
    );
    this.keydownListener = this.renderer.listen(
      window,
      'keydown',
      this.updatePositionWithDelay
    );
    this.scrollListener = this.renderer.listen(
      this.viewPort,
      'scroll',
      this.updatePosition
    );
  }

  private clearUpWebListeners(): void {
    if (this.resizeListener) {
      this.resizeListener();
      this.resizeListener = undefined;
    }
    if (this.keydownListener) {
      this.keydownListener();
      this.keydownListener = undefined;
    }
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = undefined;
    }
  }
}
