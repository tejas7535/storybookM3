import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EaEmbeddedService {
  private readonly initialized = signal<boolean>(false);

  private _bearing!: Signal<string | undefined>;
  private _language!: Signal<string | undefined>;
  private _userTier!: Signal<string | undefined>;

  public get bearing(): Signal<string | undefined> {
    if (!this.initialized()) {
      throw new Error('EaEmbeddedService not initialized');
    }

    return this._bearing;
  }

  public get language(): Signal<string | undefined> {
    if (!this.initialized()) {
      throw new Error('EaEmbeddedService not initialized');
    }

    return this._language;
  }

  public get userTier(): Signal<string | undefined> {
    if (!this.initialized()) {
      throw new Error('EaEmbeddedService not initialized');
    }

    return this._userTier;
  }

  public get isStandalone(): Signal<boolean> {
    if (!this.initialized()) {
      throw new Error('EaEmbeddedService not initialized');
    }

    return computed(() => !this._bearing() || this._bearing() === '');
  }

  public initialize(
    bearing: Signal<string | undefined>,
    language: Signal<string | undefined>,
    userTier: Signal<string | undefined>
  ): void {
    if (this.initialized()) {
      return;
    }

    this._bearing = bearing;
    this._language = language;
    this._userTier = userTier;

    this.initialized.set(true);
  }
}
