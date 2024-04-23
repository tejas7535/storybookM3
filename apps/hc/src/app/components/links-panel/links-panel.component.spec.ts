import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../assets/i18n/en.json';
import { LinksPanelComponent } from './links-panel.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('LinksPanelComponent', () => {
  let component: LinksPanelComponent;
  let spectator: Spectator<LinksPanelComponent>;

  const createComponent = createComponentFactory({
    component: LinksPanelComponent,
    imports: [SharedTranslocoModule, provideTranslocoTestingModule({ en })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when setting links Group', () => {
    beforeEach(() => {
      spectator.setInput('linkGroups', [
        {
          title: 'linkgroup1',
          links: [
            { uri: 'linkgroup1_1_uri', name: 'linkgroup1_1_name' },
            { uri: 'linkgroup1_2_uri', name: 'linkgroup1_2_name' },
          ],
        },
        {
          title: 'linkgroup2',
          links: [
            { uri: 'linkgroup2_1_uri', name: 'linkgroup2_1_name' },
            { uri: 'linkgroup2_2_uri', name: 'linkgroup2_2_name' },
          ],
        },
      ]);
      spectator.detectChanges();
    });

    it('should have 2 link groups', () => {
      expect(component.linkGroups.length).toBe(2);
    });

    it('should have 4 links', () => {
      expect(spectator.queryAll('a').length).toBe(4);
    });
  });
});
