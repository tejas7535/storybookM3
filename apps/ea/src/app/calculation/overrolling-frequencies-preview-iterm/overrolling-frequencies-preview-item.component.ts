import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  interval,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

import { CalculationResultFacade } from '@ea/core/store/facades';
import { CalculationResultPreviewItem } from '@ea/core/store/models';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TranslocoDecimalPipe } from '@jsverse/transloco-locale';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

const ANIMATION_UPDATE_INTERVAL = 2000;

@Component({
  selector: 'ea-overrolling-frequencies-preview-item',
  templateUrl: './overrolling-frequencies-preview-item.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MeaningfulRoundPipe,
    PushPipe,
  ],
  providers: [TranslocoDecimalPipe],
  animations: [
    trigger('enterExitAnimation', [
      transition(':enter', [
        style({ opacity: '0.0', transform: 'translateY(-25%)' }),
        animate(
          '500ms ease',
          style({ opacity: '1', transform: 'translateY(-50%)' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: '1', transform: 'translateY(-50%)' }),
        animate(
          '500ms ease',
          style({ opacity: '0', transform: 'translateY(-75%)' })
        ),
      ]),
    ]),
  ],
})
export class OverrollingFrequenciesPreviewItemComponent
  implements OnInit, OnDestroy
{
  @Input() styleClass: string | undefined;
  @Input() clickablePaging = false;

  public _item: CalculationResultPreviewItem;

  public readonly destroy$ = new Subject<void>();

  public readonly dataFields$: BehaviorSubject<
    CalculationResultPreviewItem['values']
  > = new BehaviorSubject([]);

  public readonly updateTrigger = interval(ANIMATION_UPDATE_INTERVAL);

  public readonly currentIndex$ = new BehaviorSubject(0);

  public readonly animationItems$ = combineLatest([
    this.currentIndex$,
    this.dataFields$,
  ]).pipe(
    map(([currentlyActiveIndex, dataItems]) =>
      dataItems.map((dataItem, i) => ({
        value: dataItem,
        index: i,
        animationState: i === currentlyActiveIndex ? 'active' : 'inactive',
      }))
    )
  );

  public readonly isLoading$ =
    this.calculationResultFacade.isOverrollingLoading$;

  public readonly resultUnavailable$ = this.dataFields$.pipe(
    map((items) => items.length === 0)
  );

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}

  @Input() set item(item: CalculationResultPreviewItem) {
    this._item = item;
    this.dataFields$.next(this._item.values);
  }

  ngOnInit(): void {
    this.updateTrigger.pipe(takeUntil(this.destroy$)).subscribe(async (_) => {
      await this.nextPage();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async selectIndex(index: number) {
    if (!this.clickablePaging) {
      return;
    }

    const currentIndex = await firstValueFrom(this.currentIndex$);
    if (index !== currentIndex) {
      this.currentIndex$.next(index);
    }
  }

  async nextPage() {
    const currentIndex = await firstValueFrom(this.currentIndex$);
    const dataItems = await firstValueFrom(this.dataFields$);
    const next = (currentIndex + 1) % dataItems.length;
    this.currentIndex$.next(next);
  }
}
