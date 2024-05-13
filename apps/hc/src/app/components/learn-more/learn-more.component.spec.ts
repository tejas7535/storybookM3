import { CommonModule } from '@angular/common';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { LinksPanelComponent } from '../links-panel/links-panel.component';
import { LearnMoreComponent } from './learn-more.component';
import { HardnessConverterApiService } from '@hc/services/hardness-converter-api.service';
import { of } from 'rxjs';
import { LinkGroups } from '@hc/models/resource-links.model';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

const MOCK_LINKS: LinkGroups = [
  {
    title: 'External URLs',
    links: [{ text: 'Google', uri: 'https://google.com' }],
  },
];

describe('LearnMoreComponent', () => {
  let component: LearnMoreComponent;
  let spectator: Spectator<LearnMoreComponent>;

  const createComponent = createComponentFactory({
    component: LearnMoreComponent,
    imports: [
      CommonModule,
      SharedTranslocoModule,
      SubheaderModule,
      RouterTestingModule,
      MatIconTestingModule,
      provideTranslocoTestingModule({ en }),
      LinksPanelComponent,
    ],
    providers: [
      {
        provide: HardnessConverterApiService,
        useValue: {
          getResourceLinks: jest.fn(() => of(MOCK_LINKS)),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('local path should be an image', () => {
    expect(component.isImage('../path/to/assets/folder.png')).toBeTruthy();
  });

  it('web anchor should be an image', () => {
    expect(component.isImage('https://www.pictum.com')).toBeTruthy();
  });

  it('text should NOT be an image', () => {
    expect(component.isImage('some random text')).toBeFalsy();
  });

  test.each([
    [[''], 15, ['']],
    [['abc def ghi'], 0, ['abc']],
    [['abc def ghi'], 4, ['abc def']],
    [['abc def ghi'], 6, ['abc def']],
    [['abc def ghi'], 16, ['abc def ghi']],
    [['abc ', 'def', 'ghi'], 0, ['abc']],
    [['abc ', 'def', 'ghi'], 2, ['abc']],
    [['abc ', 'def', 'ghi'], 5, ['abc ', 'def']],
    [['abc ', 'def', 'ghi'], 7, ['abc ', 'def']],
    [['abc ', 'def', 'ghi'], 16, ['abc ', 'def', 'ghi']],
    [['abc', '../path/to/img.png', 'ghi'], 96, ['abc']],
  ])(
    '%s truncate to %i should return %s',
    (content: string[], size: number, expected: string[]) => {
      expect(component.getTruncatedOverview(content, size)).toMatchObject(
        expected
      );
    }
  );

  it('should contain links panel', () => {
    const linksPanel = spectator.query(LinksPanelComponent);

    expect(linksPanel).toBeTruthy();
    expect(linksPanel.linkGroups).toEqual(component.linkGroups$);
  });
});
