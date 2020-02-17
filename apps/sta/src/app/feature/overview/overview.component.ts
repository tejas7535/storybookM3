import { Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';

import { BreakpointService } from '@schaeffler/shared/responsive';
import { Icon } from '@schaeffler/shared/ui-components';

@Component({
  selector: 'sta-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public elements = [
    {
      title: 'Auto Tagging',
      url: 'tagging',
      icon: new Icon('local_offer', true)
    },
    {
      title: 'Translation',
      url: 'translation',
      icon: new Icon('translate', true)
    },
    {
      title: 'Question Answering',
      url: '',
      icon: new Icon('question_answer', true)
    },
    {
      title: 'Topic Clustering',
      url: '',
      icon: new Icon('group_work', true)
    },
    {
      title: 'Sentiment Analysis',
      url: '',
      icon: new Icon(' icon-statistics')
    },
    {
      title: 'Semantic Search',
      url: '',
      icon: new Icon('image_search', true)
    },
    {
      title: 'Spell Check',
      url: '',
      icon: new Icon('spellcheck', true)
    },
    {
      title: 'SEO Relevance',
      url: '',
      icon: new Icon('insert_chart_outlined', true)
    }
  ];

  public isMobile$: Observable<boolean>;

  public constructor(private readonly breakpointService: BreakpointService) {}

  public ngOnInit(): void {
    this.isMobile$ = this.breakpointService.isMobileViewPort();
  }

  public trackByFn(index: number): number {
    return index;
  }
}
