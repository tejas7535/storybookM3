import { Injectable } from '@angular/core';

import { Pages } from '@lsa/shared/constants/pages.enum';
import { Page } from '@lsa/shared/models/page.model';

export interface LsaAppComponentState {
  pages: Page[];
  selectedPage?: Pages;
}

@Injectable({
  providedIn: 'root',
})
export class LsaAppService {
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

  public setSelectedPage(pageIndex: number): void {
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
}
