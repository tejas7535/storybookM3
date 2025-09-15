/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { EaEmbeddedService } from './ea-embedded.service';

@Component({
  template: '',
  standalone: true,
  providers: [EaEmbeddedService],
})
export abstract class EaEmbeddedRootComponent {
  protected readonly embeddedService = inject(EaEmbeddedService);
  public readonly translocoService = inject(TranslocoService);
  protected readonly destroyRef = inject(DestroyRef);

  public readonly bearing = input<string>(); // mm, ga, ec
  public readonly language = input<string>(); // mm, ga, ec, lsa
  public readonly userTier = input<string>(); // lsa -anonymos | plus | business

  public constructor() {
    this.embeddedService.initialize(
      computed(() => this.bearing()),
      computed(() => this.language()),
      computed(() => this.userTier())
    );
    effect(() => {
      setTimeout(() => {
        this.translocoService.setActiveLang(
          this.language() || this.translocoService.getDefaultLang()
        );
      }, 100);
    });
  }
}
