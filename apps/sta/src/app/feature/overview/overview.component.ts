import { Component } from '@angular/core';

@Component({
  selector: 'sta-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  public elements = [
    {
      icon: 'local_offer',
      title: 'Auto Tagging',
      url: 'tagging',
      materialIcon: true
    },
    {
      icon: 'translate',
      title: 'Translation',
      url: 'translation',
      materialIcon: true
    },
    {
      icon: 'question_answer',
      title: 'Question Answering',
      url: '',
      materialIcon: true
    },
    {
      icon: 'group_work',
      title: 'Topic Clustering',
      url: '',
      materialIcon: true
    },
    {
      icon: 'icon-statistics',
      title: 'Sentiment Analysis',
      url: '',
      materialIcon: false
    },
    {
      icon: 'image_search',
      title: 'Semantic Search',
      url: '',
      materialIcon: true
    },
    {
      icon: 'spellcheck',
      title: 'Spell Check',
      url: '',
      materialIcon: true
    },
    {
      icon: 'insert_chart_outlined',
      title: 'SEO Relevance',
      url: '',
      materialIcon: true
    }
  ];

  public trackByFn(index: number): number {
    return index;
  }
}
