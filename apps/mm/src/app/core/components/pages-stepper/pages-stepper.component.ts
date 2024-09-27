import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

import { PageMetaStatus } from '@caeonline/dynamic-forms';
import { QualtricsInfoBannerComponent } from '@mm/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { StepperModule } from '@schaeffler/stepper';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { STEPNAME } from '../../../shared/constants/tracking-names';
import { PageBeforePipe } from './page-before.pipe';

// TODO use Ids for active state
@Component({
  selector: 'mm-pages-stepper',
  templateUrl: './pages-stepper.component.html',
  styleUrls: ['./pages-stepper.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    StepperModule,
    SharedTranslocoModule,
    QualtricsInfoBannerComponent,
    PageBeforePipe,
  ],
  providers: [PageBeforePipe],
  // changeDetection: ChangeDetectionStrategy.OnPush, // TODO Enable when pageVisibility is async
})
export class PagesStepperComponent implements OnChanges {
  @Input() public pages: PageMetaStatus[] = [];

  @Input() public activePageId: string;

  @Input() public maxPageId?: string;

  @Input() public inactivePageId?: string;

  @Output() public activePageIdChange = new EventEmitter<string>();

  @ViewChild('stepper') private readonly stepper: MatStepper;

  public constructor(
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  get pageTitleTranslationKey(): string {
    const currentPage = this.pages.find(
      (page) => page.id === this.activePageId
    );

    // remove optional chaining operator once home component will be refactored as test are using stepper implementation.
    return currentPage?.page?.text;
  }

  public get hasNext(): boolean {
    const lastPage = this.getVisiblePages().at(-1);

    return lastPage && lastPage.id !== this.activePageId;
  }

  public get hasResultNext(): boolean {
    const visiblePages = this.getVisiblePages();
    const currentPageIndex = visiblePages.findIndex(
      (visiblePage) => visiblePage.id === this.activePageId
    );
    const targetPageIndex = currentPageIndex + 1;

    return visiblePages[targetPageIndex].id === 'PAGE_RESULT';
  }

  public get hasPrev(): boolean {
    const firstPage = this.getVisiblePages().slice(0, 1).pop();

    return firstPage && firstPage.id !== this.activePageId;
  }

  public ngOnChanges(): void {
    this.pages = this.pages.filter((page) => page.isParent);

    if (this.stepper) {
      this.stepper.selectedIndex = this.stepper.steps['_results']
        .map((step: any, index: number) => ({ ...step, index }))
        .find((step: any) => step.label === this.activePageId).index;
    }

    const step = this.stepper?.selectedIndex ?? 0;
    const name = `[Step ${step + 1}: ${this.pages[step].id}]`;

    this.trackSteps(name);
  }

  public trackSteps(name: string): void {
    this.applicationInsightsService.logEvent(name, {
      name: STEPNAME,
    });
  }

  public activate(event: StepperSelectionEvent): void {
    this.activePageIdChange.emit(event.selectedStep.label);
  }

  public prev(): void {
    this.navigatePage(-1);
  }

  public next(): void {
    this.navigatePage(1);
  }

  public reset(): void {
    const visiblePages = this.getVisiblePages();
    this.activePageIdChange.emit(visiblePages[0].id);
  }

  private navigatePage(direction: -1 | 1): void {
    const visiblePages = this.getVisiblePages();
    const currentPageIndex = visiblePages.findIndex(
      (visiblePage) => visiblePage.id === this.activePageId
    );
    const targetPageIndex = currentPageIndex + direction;

    if (
      currentPageIndex >= 0 &&
      targetPageIndex >= 0 &&
      targetPageIndex < visiblePages.length
    ) {
      this.activePageIdChange.emit(visiblePages[targetPageIndex].id);
    }
  }

  private getVisiblePages(): PageMetaStatus[] {
    return this.pages.filter(
      (page) => page.visible && page.id !== this.inactivePageId
    );
  }
}
