import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { translate } from '@jsverse/transloco';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LinksPanelComponent } from '../links-panel/links-panel.component';
import { LinkGroup } from './models';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SharedTranslocoModule,
    SubheaderModule,
    LinksPanelComponent,
  ],
  templateUrl: './learn-more.component.html',
})
export class LearnMoreComponent {
  public readonly linkGroups: LinkGroup[] = [
    {
      title: 'linkgroup1',
      links: [
        { uri: 'linkgroup1_1_uri', name: 'linkgroup1_1_name' },
        { uri: 'linkgroup1_2_uri', name: 'linkgroup1_2_name' },
        { uri: 'linkgroup1_3_uri', name: 'linkgroup1_3_name' },
        { uri: 'linkgroup1_4_uri', name: 'linkgroup1_4_name' },
        { uri: 'linkgroup1_5_uri', name: 'linkgroup1_5_name' },
        { uri: 'linkgroup1_6_uri', name: 'linkgroup1_6_name' },
        { uri: 'linkgroup1_7_uri', name: 'linkgroup1_7_name' },
      ],
    },
    {
      title: 'linkgroup2',
      links: [
        { uri: 'linkgroup2_1_uri', name: 'linkgroup2_1_name' },
        { uri: 'linkgroup2_2_uri', name: 'linkgroup2_2_name' },
        { uri: 'linkgroup2_3_uri', name: 'linkgroup2_3_name' },
        { uri: 'linkgroup2_4_uri', name: 'linkgroup2_4_name' },
        { uri: 'linkgroup2_5_uri', name: 'linkgroup2_5_name' },
        { uri: 'linkgroup2_6_uri', name: 'linkgroup2_6_name' },
      ],
    },
  ];

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
