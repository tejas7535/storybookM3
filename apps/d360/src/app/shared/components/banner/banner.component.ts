import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { filter, tap } from 'rxjs';

import { translate } from '@jsverse/transloco';

import { AlertComponent, AlertType as AlertTypes } from '@schaeffler/alert';

import {
  SystemMessageKey,
  SystemMessageSettings,
  UserSettingsKey,
} from '../../models/user-settings.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'd360-banner',
  template: `
    @if (this.isActive()) {
      <schaeffler-alert
        class="block p-4 pb-0 no-html"
        [type]="type()"
        [headline]="headline()"
        [actionText]="button()"
        [description]="message()"
        (buttonClicked)="onButtonClicked()"
      />
    }
  `,
  imports: [AlertComponent],
})
export class BannerComponent implements OnInit {
  private readonly STORAGE_NAME = 'closedBannerHash';
  protected readonly type: WritableSignal<AlertTypes | null> =
    signal<AlertTypes | null>(null);
  protected readonly message: WritableSignal<string | null> = signal<
    string | null
  >(null);
  protected readonly headline: WritableSignal<string | null> = signal<
    string | null
  >(null);
  protected readonly button: WritableSignal<string | null> = signal<
    string | null
  >(null);

  private readonly active: WritableSignal<boolean> = signal<boolean>(false);
  private readonly contentHash: WritableSignal<string | null> = signal<
    string | null
  >(null);
  private readonly storedContentHash: WritableSignal<string | null> = signal<
    string | null
  >(null);
  private readonly storage: Storage = localStorage;

  private readonly userService: UserService = inject<UserService>(UserService);
  private readonly destroyRef: DestroyRef = inject<DestroyRef>(DestroyRef);

  protected readonly isActive: Signal<boolean> = computed(
    () =>
      this.contentHash() !== this.storedContentHash() &&
      this.active() &&
      !!(this.type() && (this.headline() || this.message()))
  );

  private resetState(): void {
    this.storedContentHash.set(null);
    this.storage.removeItem(this.STORAGE_NAME);
  }

  private saveState(): void {
    this.storage.setItem(this.STORAGE_NAME, this.contentHash());
    this.storedContentHash.set(this.contentHash());
  }

  protected onButtonClicked(): void {
    this.saveState();
  }

  public ngOnInit(): void {
    this.storedContentHash.set(this.storage.getItem(this.STORAGE_NAME));

    this.userService.settingsLoaded$
      .pipe(
        filter((loaded: boolean) => loaded),
        tap(() => {
          const settings: SystemMessageSettings | null | undefined =
            this.userService.userSettings()?.[UserSettingsKey.SystemMessage] ??
            null;

          this.message.set(settings?.[SystemMessageKey.Message] || null);
          this.headline.set(settings?.[SystemMessageKey.Headline] || null);
          this.contentHash.set(
            settings?.[SystemMessageKey.ContentHash] || null
          );
          this.type.set(
            settings?.[SystemMessageKey.Type]
              ? (String(
                  settings[SystemMessageKey.Type]
                ).toLowerCase() as AlertTypes)
              : null
          );
          this.active.set(settings?.[SystemMessageKey.Active] || false);

          this.button.set(
            settings?.[SystemMessageKey.Closable]
              ? translate('button.close')
              : null
          );

          if (this.storedContentHash() !== this.contentHash()) {
            this.resetState();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
