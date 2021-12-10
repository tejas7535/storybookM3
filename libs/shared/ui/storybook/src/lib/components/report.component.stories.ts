import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { DUMMY, ReportComponent, ReportModule } from '@schaeffler/report';

import READMEMd from '../../../../picture-card/README.md';
import { NavigationMain } from '../../../.storybook/storybook-navigation.constants';

export default {
  title: `${NavigationMain.Components}/Report`,
  component: ReportComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReportModule,
        MatButtonModule,
      ],
    }),
  ],
  parameters: {
    notes: { markdown: READMEMd },
  },
} as Meta<ReportComponent>;

const props = {
  title: 'Report Title',
  subtitle: 'Report Subtitle',
  downloadReport:
    'https://mountingmanager-cae.schaeffler.com/api/v1/bearing-calculation/pdf/8c8a9bb8c41745e9baf9200e656b0e05',
};

const template = `
<schaeffler-report
    [title]="title"
    [subtitle]="subtitle"
    [htmlReport]="htmlReport"
    [jsonReport]="jsonReport"
    [downloadReport]="downloadReport">
    <div class="flex flex-col md:flex-row">
        <a
        mat-raised-button
        color="primary"
        class="grow m-2"
        [href]="downloadReport"
        >
            Download Report
        </a>
        <button
        mat-button
        class="grow m-2">
            Do Something Else
        </button>
    </div>
</schaeffler-report>
`;

const Template: Story<ReportComponent> = (args: ReportComponent) => ({
  component: ReportComponent,
  props: args,
  template,
});

export const HtmlReport = Template.bind({});
HtmlReport.args = {
  ...props,
  htmlReport:
    'https://mountingmanager-cae.schaeffler.com/api/v1/bearing-calculation/body/8c8a9bb8c41745e9baf9200e656b0e05',
};

export const JsonReport = Template.bind({});
JsonReport.args = {
  ...props,
  jsonReport: DUMMY,
};
