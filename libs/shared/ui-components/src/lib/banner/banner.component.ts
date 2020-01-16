import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { select, Store } from '@ngrx/store';
import { sharedScopeLoader } from '@schaeffler/shared/transloco';

import { BannerService } from './banner.service';

import { BannerState } from './store/reducers/banner/banner.reducer';

import { BannerContent } from './banner-content';
import { DynamicComponentDirective } from './dynamic-component-directive/dynamic-component.directive';
import { getBannerOpen, getBannerUrl } from './store';
import * as BannerActions from './store/actions';

// tslint:disable-next-line: only-arrow-functions
export async function importer(lang: string, root: string): Promise<any> {
  return import(`./${root}/${lang}.json`);
}

@Component({
  selector: 'schaeffler-banner',
  templateUrl: 'banner.component.html',
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'banner',
        loader: sharedScopeLoader(['de', 'en'], importer)
      }
    }
  ]
})
export class BannerComponent implements OnInit, OnDestroy {
  @Output() readonly bannerClose: EventEmitter<void> = new EventEmitter();

  private readonly destroy$: Subject<boolean> = new Subject();

  public isBannerShown: Observable<boolean>;

  private url: string;

  // tslint:disable-next-line: prefer-inline-decorator
  @ViewChild(DynamicComponentDirective, { static: false })
  public dynamicComponent: DynamicComponentDirective;

  constructor(
    private readonly bannerService: BannerService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly router: Router,
    private readonly store: Store<BannerState>
  ) {}

  /**
   * Subscribes to infoBannerService
   */
  public ngOnInit(): void {
    this.isBannerShown = this.store.pipe(
      takeUntil(this.destroy$),
      select(getBannerOpen)
    );
    this.isBannerShown.subscribe(open => {
      if (open !== undefined && !open) {
        this.bannerClose.emit();
      }
    });
    this.store
      .pipe(
        takeUntil(this.destroy$),
        select(getBannerUrl)
      )
      .subscribe(url => {
        this.url = url;
      });

    this.bannerService.bannerComponent
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data.component) {
          setTimeout(() => {
            this.generateDynamicComponent(data.component);
          });
        }
      });

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (
        event instanceof NavigationEnd &&
        event.url !== this.url &&
        event.urlAfterRedirects !== this.url
      ) {
        this.store.dispatch(BannerActions.closeBanner());
      }
    });
  }

  /**
   * Destroys Subscription
   */
  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * generates dynamic component and attaches it to the view
   */
  private generateDynamicComponent(component: BannerContent): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      component as any
    );

    const viewContainerRef = this.dynamicComponent.viewContainerRef;
    viewContainerRef.clear();

    viewContainerRef.createComponent(componentFactory);
  }
}
