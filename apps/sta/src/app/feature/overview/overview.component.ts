import { Component } from '@angular/core';

import { Icon } from '@schaeffler/icons';

@Component({
  selector: 'sta-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  public elements = [
    {
      title: 'Auto Tagging',
      url: 'tagging',
      icon: new Icon('local_offer', true),
    },
    {
      title: 'Translation',
      url: 'translation',
      icon: new Icon('translate', true),
    },
    {
      title: 'Question Answering',
      url: 'question-answering',
      icon: new Icon('question_answer', true),
    },
    {
      title: 'Topic Clustering',
      url: '',
      icon: new Icon('group_work', true),
    },
    {
      title: 'Sentiment Analysis',
      url: '',
      icon: new Icon(' icon-statistics'),
    },
    {
      title: 'Semantic Search',
      url: '',
      icon: new Icon('image_search', true),
    },
    {
      title: 'Spell Check',
      url: '',
      icon: new Icon('spellcheck', true),
    },
    {
      title: 'SEO Relevance',
      url: '',
      icon: new Icon('insert_chart_outlined', true),
    },
  ];

  public trackByFn(index: number): number {
    return index;
  }
}
