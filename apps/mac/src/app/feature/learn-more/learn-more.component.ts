import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Observable, of } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { Store, StoreModule } from '@ngrx/store';

import { hasIdTokenRoles } from '@schaeffler/azure-auth';
import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SafeHtmlPipe } from '@mac/shared/pipes/safe-html/safe-html.pipe';

import { GuideGroup, LinkGroup } from './models';

@Component({
  selector: 'mac-learn-more',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    SharedTranslocoModule,
    StoreModule,
    SubheaderModule,
    PushPipe,
    SafeHtmlPipe,
  ],
  templateUrl: './learn-more.component.html',
})
export class LearnMoreComponent implements OnInit, AfterViewInit {
  public imgUrl = '';
  public darkenImg = false;
  public linkGroups: LinkGroup[] = [];
  public svgIconUrl: string = undefined;
  public content: string[] = [];
  public guides: GuideGroup[] = [];
  public translocoKey = 'default';
  public requiredRoles: string[] = [];
  public breadcrumbs: Breadcrumb[] = [];
  public appLink: string;
  public samsLink?: string;
  public showMore = false;

  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly activatedroute: ActivatedRoute,
    private readonly store: Store
  ) {
    this.breadcrumbs = [
      {
        label: translate('title'),
        url: '/overview',
      },
      {
        label: translate('learnmore.title'),
      },
    ];
  }

  ngOnInit(): void {
    this.activatedroute.data.subscribe((data) => {
      // I don't know why this is wrapped in `data`
      const learnMore = data.data;
      this.imgUrl = learnMore.imgUrl;
      this.darkenImg = learnMore.darkenImg;
      this.svgIconUrl = learnMore.svgIconUrl;
      this.content = learnMore.content;
      this.guides = learnMore.guides;
      this.linkGroups = learnMore.linkGroups;
      this.requiredRoles = learnMore.requiredRoles || [];
      this.translocoKey = learnMore.translocoKey;
      this.samsLink = learnMore.samsLink;
      this.appLink = learnMore.appLink;

      if (this.svgIconUrl) {
        this.matIconRegistry.addSvgIcon(
          this.svgIconUrl,
          this.domSanitizer.bypassSecurityTrustResourceUrl(this.svgIconUrl)
        );
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.activatedroute.snapshot.fragment) {
      document
        .querySelector(`#${this.activatedroute.snapshot.fragment}`)
        ?.scrollIntoView();
    }
  }

  public hasRequiredRoles(): Observable<boolean> {
    if (this.requiredRoles.length === 0) {
      return of(true);
    }

    return this.store.pipe(hasIdTokenRoles(this.requiredRoles));
  }

  public toggleShowMore() {
    this.showMore = !this.showMore;
  }

  public isImage(s: string): boolean {
    return (
      s.startsWith('../') || s.startsWith('http') || s.startsWith('%ASSETS')
    );
  }

  public getAssetPath(s: string): string {
    return s.replaceAll('%ASSETS', '/assets');
  }

  public getTruncatedOverview(content: string[], size = 400): string[] {
    const truncated: string[] = [];
    let charCount = 0;
    let i = 0;
    do {
      const str: string = content[i];
      const left = size - charCount;
      charCount += str.length;
      i += 1;
      // immediatelly stop on image
      if (this.isImage(str)) {
        return truncated;
      }
      // push content
      if (left >= str.length) {
        truncated.push(str);
      } else {
        // truncate content to allowed size - look for end of word.
        let end = str.indexOf(' ', left);
        if (end <= 0) {
          end = str.length;
        }
        const subStr = str.slice(0, end);
        truncated.push(subStr);
      }
    } while (content.length > i && charCount < size);

    return truncated;
  }
}
