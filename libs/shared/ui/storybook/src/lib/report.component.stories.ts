import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { text } from '@storybook/addon-knobs';

import { ReportComponent, ReportModule } from '@schaeffler/report';

import READMEMd from '../../../picture-card/README.md';

export default {
  title: 'Report',
  parameters: {
    notes: { markdown: READMEMd },
  },
};

const baseComponent = {
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      HttpClientModule,
      ReportModule,
      MatButtonModule,
    ],
  },
  component: ReportComponent,
};

const props = {
  title: text('title', 'Report Title'),
  subtitle: text('subtitle', 'Report Subtitle'),
  displayReport: text(
    'displayReport',
    'https://mountingmanager-cae.schaeffler.com/api/v1/bearing-calculation/body/8c8a9bb8c41745e9baf9200e656b0e05'
  ),
  downloadReport: text(
    'displayReport',
    'https://mountingmanager-cae.schaeffler.com/api/v1/bearing-calculation/pdf/8c8a9bb8c41745e9baf9200e656b0e05'
  ),
};

export const primary = () => ({
  ...baseComponent,
  props,
});

export const withButtons = () => ({
  ...baseComponent,
  props,
  template: `
    <schaeffler-report
        [title]="title"
        [subtitle]="subtitle"
        [displayReport]="displayReport"
        [downloadReport]="downloadReport">
        <div class="flex flex-col md:flex-row">
            <a
            mat-raised-button
            color="primary"
            class="text-button uppercase flex-grow m-2"
            [href]="downloadReport"
            >
                Download Report
            </a>
            <button
            mat-button
            class="
              text-button uppercase text-primary flex-grow m-2
            ">
                Do Something Else
            </button>
        </div>
    </schaeffler-report>
  `,
});
