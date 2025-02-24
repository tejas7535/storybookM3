import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultMessagesComponent } from '../calculation-result-messages/calculation-result-messages.component';
import { ReportExpansionPanelComponent } from '../report-expansion-panel/report-expansion-panel.component';
import { ReportMessagesComponent } from './report-messages.component';

describe('ReportMessagesComponent', () => {
  let spectator: Spectator<ReportMessagesComponent>;

  const createComponent = createComponentFactory({
    component: ReportMessagesComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('when there are no messages', () => {
    it('the component should not display messages and use fallback value', () => {
      const messageComponent = spectator.query(
        CalculationResultMessagesComponent
      );
      expect(messageComponent).toBeFalsy();
    });
  });

  describe('when some of the messages are provided', () => {
    beforeEach(() => {
      spectator.setInput('messages', {
        notes: ['note 1', 'note 2'],
        errors: [],
        warnings: [],
      });
      spectator.setInput('isMessageSectionExpanded', false);
    });

    it('should render messages sections', () => {
      const messageComponents = spectator.queryAll(
        CalculationResultMessagesComponent
      );

      expect(messageComponents).toHaveLength(3);

      const notes = messageComponents[2];
      expect(notes).not.toBeNull();
      expect(notes.title).toBe('notes');
      expect(notes.messages).toStrictEqual(['note 1', 'note 2']);
    });

    it('should not expand panel by default', () => {
      const expansionPanel = spectator.query(ReportExpansionPanelComponent);

      expect(expansionPanel?.expanded).toBe(false);
    });
  });

  describe('when expansion panel property is set to true', () => {
    beforeEach(() => {
      spectator.setInput('messages', {
        notes: ['note 1', 'note 2'],
        errors: [],
        warnings: [],
      });

      spectator.setInput('isMessageSectionExpanded', true);
    });

    it('should expand panel', () => {
      const expansionPanel = spectator.query(ReportExpansionPanelComponent);

      expect(expansionPanel?.expanded).toBe(true);
    });
  });
});
