import { BrowserPlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'platform',
  useFactory: () => new StaticPlatformLocation(),
})
export class StaticPlatformLocation extends BrowserPlatformLocation {
  private readonly history: History;

  public constructor() {
    super();
    this.history = window.history;
  }

  public override get pathname(): string {
    return this.history.state?.url || '';
  }

  public override pushState(state: any, title: string, url: string) {
    this.history.pushState(
      {
        ...state,
        url,
      },
      title
    );
  }

  public override replaceState(state: any, title: string, url: string) {
    this.history.replaceState(
      {
        ...state,
        url,
      },
      title
    );
  }
}
