import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { map } from 'rxjs';

import { AuthService } from '@hc/services/auth.service';
import { HardnessConverterApiService } from '@hc/services/hardness-converter-api.service';
import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LinksPanelComponent } from '../links-panel/links-panel.component';
import { HideLoginElementsPipe } from './hide-loginelement.pipe';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SharedTranslocoModule,
    SubheaderModule,
    LinksPanelComponent,
    PushPipe,
    HideLoginElementsPipe,
  ],
  templateUrl: './learn-more.component.html',
})
export class LearnMoreComponent {
  public linkGroups$ = this.hcService.getResourceLinks();

  public breadcrumbs: Breadcrumb[] = [
    {
      label: translate('title'),
      url: '/',
    },
    {
      label: translate('learnmore.title'),
    },
  ];

  public content: string[] = [];

  constructor(
    private readonly hcService: HardnessConverterApiService,
    private readonly authService: AuthService
  ) {}

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

  public hideInternalUrls() {
    return this.authService.isLoggedin().pipe(map((loggedIn) => !loggedIn));
  }
}
