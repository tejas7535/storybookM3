import { Component } from '@angular/core';

import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ReportMessagesComponent } from './report-messages/report-messages.component';
import { ResultReportComponent } from './result-report.component';

@Component({ selector: 'schaeffler-host-result-report', template: '' })
class CustomHostComponent {}

describe('ResultReportComponent', () => {
  let spectator: SpectatorHost<ResultReportComponent, CustomHostComponent>;
  let component: ResultReportComponent;

  const createHost = createHostFactory({
    component: ResultReportComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createHost(
      `<schaeffler-result-report>
        <div report-header-content>
          <span class="header-content"></span> 
        </div> 
         <div report-main-content>
          <div class="main-content"></div> 
        </div> 
        <div report-footer-content>
          <div class="footer-content"></div> 
        </div> 
        <div report-right-sidebar>
          <div class="sidebar-content"></div> 
        </div> 
      </schaeffler-result-report>`
    );
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('when there are no messages', () => {
    it('should pass empty messages to child component', () => {
      const messageComponent = spectator.query(ReportMessagesComponent);
      expect(messageComponent).toBeTruthy();

      expect(messageComponent?.messages.errors).toEqual([]);
      expect(messageComponent?.messages.notes).toEqual([]);
      expect(messageComponent?.messages.warnings).toEqual([]);
      expect(messageComponent?.messages.isMessageSectionExpanded).toBe(false);
    });
  });

  describe('should render projected content', () => {
    it('should render header content', () => {
      expect(spectator.query('.header-content')).toBeTruthy();
    });

    it('should render main content', () => {
      expect(spectator.query('.main-content')).toBeTruthy();
    });

    it('should render footer content', () => {
      expect(spectator.query('.footer-content')).toBeTruthy();
    });

    it('should render right sidebar content', () => {
      expect(spectator.query('.sidebar-content')).toBeTruthy();
    });
  });
});
