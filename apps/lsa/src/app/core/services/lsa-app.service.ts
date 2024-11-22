import { Injectable } from '@angular/core';

import { Pages } from '@lsa/shared/constants/pages.enum';
import { Page } from '@lsa/shared/models';

import { GoogleAnalyticsService } from './google-analytics';

export interface LsaAppComponentState {
  pages: Page[];
  selectedPage?: Pages;
}

@Injectable({
  providedIn: 'root',
})
export class LsaAppService {
  private readonly firstStep = 1;
  private readonly appState: LsaAppComponentState = {
    pages: [
      {
        name: Pages.LubricationPoints,
        completed: false,
      },
      {
        name: Pages.Lubricant,
        completed: false,
      },
      {
        name: Pages.Application,
        completed: false,
      },
      {
        name: Pages.Result,
        completed: false,
      },
    ],
  };

  constructor(private readonly googleAnalyticsService: GoogleAnalyticsService) {
    this.logStepEvent(this.firstStep);
  }

  public setSelectedPage(pageIndex: number): void {
    const stepIndex = pageIndex + this.firstStep;
    this.logStepEvent(stepIndex);
    this.appState.selectedPage = this.appState.pages[pageIndex].name;
  }

  public getSelectedPage(): Pages | undefined {
    return this.appState.selectedPage;
  }

  public setCompletedStep(pageIndex: number): void {
    this.appState.pages[pageIndex].completed = true;
  }

  public getPages(): Page[] {
    return this.appState.pages;
  }

  private logStepEvent(index: number): void {
    this.googleAnalyticsService.logStepLoadEvent(index);
  }
}
