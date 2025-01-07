import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CO2EmissionResult } from '@ea/core/store/selectors/calculation-result/calculation-result-report.selector';
import { CHARTS_COLORS } from '@ea/shared/constants/charts-colors';
import { TranslocoService } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ReportCo2EmissionsValuesComponent } from '../report-co2-emissions-values/report-co2-emissions-values.component';

interface ResultItem {
  id: string;
  emission: number;
  emissionPercentage: number;
  operatingTimeInHours: number;
}

@Component({
  selector: 'ea-calculation-downstream-emission',
  templateUrl: './calculation-downstream-emission.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReportCo2EmissionsValuesComponent,
    SharedTranslocoModule,
    MatIconModule,
    MatButtonModule,
  ],
  animations: [
    trigger('swipe', [
      transition(
        ':enter',
        [
          style({ transform: '{{enterTransform}}' }),
          animate('300ms ease-out', style({ transform: 'translateX(0)' })),
        ],
        { params: { enterTransform: 'translateX(100%)' } }
      ),
      transition(
        ':leave',
        [animate('300ms ease-out', style({ transform: '{{leaveTransform}}' }))],
        { params: { leaveTransform: 'translateX(-100%)' } }
      ),
    ]),
  ],
})
export class CalculationDownstreamEmissionComponent
  implements OnInit, OnDestroy
{
  @Input()
  public downstreamError?: string;

  @Output() selectedIndexChange: EventEmitter<number> = new EventEmitter();

  public _downstreamEmission: ResultItem[] = [];
  public readonly chartColors = CHARTS_COLORS;
  public swipeDirection: 'left' | 'right' = 'left';

  private _selectedIndex: number | undefined;

  private touchStartX = 0;
  private touchEndX = 0;

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly el: ElementRef
  ) {}

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  @Input() set selectedIndex(index: number | undefined) {
    this._selectedIndex = index ?? 0;
  }

  @Input() set downstreamEmission(
    emission: CO2EmissionResult['co2_downstream']
  ) {
    const operatingTimeInHours = emission?.loadcases?.reduce(
      (total, loadcase) => total + loadcase.operatingTimeInHours,
      0
    );
    const emissionItems: ResultItem[] = [
      {
        id: this.translocoService.translate(
          'calculationResultReport.co2Emissions.totalDownstreamButton'
        ),
        emission: emission?.emission,
        emissionPercentage: emission?.emissionPercentage,
        operatingTimeInHours,
      },
    ];

    if (emission.loadcases?.length > 1) {
      emissionItems.push(...emission.loadcases);
    }

    this._downstreamEmission = emissionItems;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get downstreamEmission(): ResultItem[] {
    return this._downstreamEmission;
  }

  ngOnInit() {
    this.el.nativeElement.addEventListener(
      'touchstart',
      this.onTouchStart.bind(this),
      { passive: true }
    );
    this.el.nativeElement.addEventListener(
      'touchmove',
      this.onTouchMove.bind(this),
      { passive: true }
    );
    this.el.nativeElement.addEventListener(
      'touchend',
      this.onTouchEnd.bind(this),
      { passive: true }
    );
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
  }

  onTouchEnd(): void {
    const swipeThreshold = 30; // Minimum swipe distance in pixels

    if (Math.abs(this.touchEndX - this.touchStartX) > swipeThreshold) {
      if (this.touchEndX < this.touchStartX) {
        this.nextItem();
      } else if (this.touchEndX > this.touchStartX) {
        this.previousItem();
      }
    }
  }

  previousItem(): void {
    const previous = this.selectedIndex - 1;
    if (previous >= 0) {
      this.selectedIndexChange.emit(previous);
      this.swipeDirection = 'right';
    } else {
      this.selectedIndexChange.emit(0);
    }
  }

  nextItem(): void {
    const next = this.selectedIndex + 1;

    if (next < this._downstreamEmission.length) {
      this.swipeDirection = 'left';
      this.selectedIndexChange.emit(next);
    }
  }

  selectItem(index: number) {
    this.selectedIndexChange.emit(index);
  }

  getSwipeParams() {
    const directions = {
      left: {
        enterTransform: 'translateX(100%)',
        leaveTransform: 'translateX(-100%)',
      },
      right: {
        enterTransform: 'translateX(-100%)',
        leaveTransform: 'translateX(100%)',
      },
    };

    return {
      value: '',
      params: directions[this.swipeDirection],
    };
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('touchstart', this.onTouchStart);
    this.el.nativeElement.removeEventListener('touchmove', this.onTouchMove);
    this.el.nativeElement.removeEventListener('touchend', this.onTouchEnd);
  }
}
